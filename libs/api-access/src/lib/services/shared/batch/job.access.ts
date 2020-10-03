import { Injectable } from '@nestjs/common';
import {
  AccessContext,
  AccessQuery,
  GenericAccessUtil,
  IModelFields,
  LogService,
  SortDirection,
  AccessQueryFactory,
} from '@ocw/api-core';
import { DateUtil } from '@ocw/shared-core';
import {
  JobDocument,
  JobDocumentAttribute,
  JobSearchRequest,
  JobStatus,
  JobType,
  BaseDocument,
  AuditInfoField,
  BaseDocumentField,
} from '@ocw/shared-models';
import { JobTable, JobTableColumns, JobTableConfig } from '../../../tables/job';
import {
  JobTaskTableColumns,
  JobTaskTableConfig,
} from '../../../tables/job_task';

@Injectable()
export class JobAccess {
  constructor(
    private readonly logService: LogService,
    private readonly accessQueryFactory: AccessQueryFactory
  ) {}

  async checkForNewJob(accessContext: AccessContext) {
    const ts = DateUtil.getGMTDateTs();
    const pastTs = DateUtil.addMinutes(ts, -10);
    const result = await accessContext.knex.raw(
      `update ${JobTableConfig.tableName} 
      set ${JobTableColumns.job_status_id}  =  ${JobStatus.InProcess} 
      OUTPUT INSERTED.*
      WHERE  ${JobTableColumns.job_id} in (
        SELECT  ${JobTableColumns.job_id}
        FROM ${JobTableConfig.tableName} 
        WHERE (
         ${JobTableColumns.job_status_id} =  ${JobStatus.Staged} 
        OR 
        ${JobTableColumns.job_status_id} =  ${JobStatus.InProcess} 
        AND
         ${IModelFields.row_version} < ${pastTs}
        )
        ORDER BY ${JobTableColumns.job_id}
        FOR UPDATE SKIP LOCKED
        LIMIT 1
      )
      ;`
    );
    this.logService.log(result, 'JobAccess.checkForNewJob');
    return result.rows as JobTable<any>[];
  }

  async updateJobTimestamp(
    jobId: string,
    accessContext: AccessContext
  ): Promise<void> {
    const ts = DateUtil.getGMTDateTs();
    const sql = ` 
    update  ${JobTableConfig.tableName} set ${IModelFields.row_version} = ?
    where ${JobTableColumns.job_id} = ? 
    and ${JobTableColumns.job_status_id} != ?`;
    const result = await accessContext.knex.raw(sql, [
      ts,
      jobId,
      JobStatus.Complete,
    ]);
    this.logService.log(result, 'JobAccess.updateJobStatus');
  }

  async updateJobStatus(accessContext: AccessContext): Promise<void> {
    const sql = ` 
    update  ${JobTableConfig.tableName} i set ${JobTableColumns.job_status_id} = ${JobStatus.Complete} 
                  where not exists (
                    select ${JobTableColumns.job_id} 
                    from ${JobTaskTableConfig.tableName} 
                    where ${JobTableColumns.job_id} = i.${JobTableColumns.job_id}
    and ${JobTaskTableColumns.status_id} != ${JobStatus.Complete} 
    ) `;
    const result = await accessContext.knex.raw(sql);
    this.logService.log(result, 'JobAccess.updateJobStatus');
  }

  async add<T extends BaseDocument>(
    jobTypeId: JobType,
    jobSubTypeId: number,
    doc: T,
    accessContext: AccessContext
  ): Promise<T> {
    const dt = DateUtil.getGMTDateTs();
    return await GenericAccessUtil.add(accessContext, doc, JobTableConfig, {
      [JobTableColumns.job_status_id]: JobStatus.Staged,
      [JobTableColumns.job_type_id]: jobTypeId,
      [JobTableColumns.job_subtype_id]: jobSubTypeId,
      [JobTableColumns.start_dt]: dt,
    });
  }

  async search<T>(
    request: JobSearchRequest,
    accessContext: AccessContext
  ): Promise<JobDocument<T>[]> {
    const accessQuery = this.accessQueryFactory.createQuery(JobTableConfig);

    if (request.startDt) {
      accessQuery.addWhereJsonPath(
        [BaseDocumentField.auditInfo, AuditInfoField.crtTs],
        `${request.startDt}`,
        '>='
      );
    }
    if (request.jobTypeEquals) {
      accessQuery.addWhere(JobTableColumns.job_type_id, request.jobTypeEquals);
    }
    if (request.jobSubTypeEquals) {
      accessQuery.addWhere(
        JobTableColumns.job_subtype_id,
        request.jobSubTypeEquals
      );
    }
    if (request.jobStatusEquals) {
      accessQuery.addWhere(
        JobTableColumns.job_status_id,
        request.jobStatusEquals
      );
    }
    accessQuery.addOrderByJsonEntityAttribute(
      BaseDocumentField.auditInfo,
      AuditInfoField.crtTs,
      SortDirection.desc
    );
    accessQuery.Columns.addColumn(JobTableColumns.job_status_id);
    accessQuery.Columns.addColumn(JobTableColumns.job_subtype_id);
    accessQuery.Columns.addColumn(JobTableColumns.job_type_id);
    const items = await accessQuery.select();
    return items.map((p: JobTable<T>) => {
      return this.transformDocument(p);
    }) as JobDocument<T>[];
  }

  transformDocument<T>(p: JobTable<T>): any {
    this.logService.log(p);
    p[IModelFields.json_document][BaseDocumentField.rowVersion] =
      p[IModelFields.row_version];
    p[IModelFields.json_document][BaseDocumentField.id] =
      p[JobTableConfig.keyFieldName];
    p[IModelFields.json_document][JobDocumentAttribute.status] =
      p.job_status_id;
    p[IModelFields.json_document][JobDocumentAttribute.type] = p.job_type_id;
    p[IModelFields.json_document][JobDocumentAttribute.subType] =
      p.job_subtype_id;
    return p[IModelFields.json_document];
  }
}
