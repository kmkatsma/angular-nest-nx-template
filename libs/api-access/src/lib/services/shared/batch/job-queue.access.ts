import { Injectable } from '@nestjs/common';
import {
  AccessContext,
  GenericAccessUtil,
  LogService
} from '@ocw/api-core';
import { BaseDocument } from '@ocw/shared-models';
import { JobStatus } from '@ocw/shared-models';
import {
  JobQueueTable,
  JobQueueTableColumns,
  JobQueueTableConfig
} from '../../../tables/job_queue';
import {
  JobTaskTableConfig,
  JobTaskTableColumns
} from '../../../tables/job_task';
import { JobTableConfig, JobTableColumns } from '../../../tables/job';

@Injectable()
export class JobQueueAccess {
  constructor(private readonly logService: LogService) {}

  async markJobCompleteOrFailed(
    jobId: string,
    accessContext: AccessContext
  ): Promise<void> {
    const openTasks = await accessContext.knex.raw(
      `SELECT * FROM ${JobTaskTableConfig.tableName}
       WHERE ${JobTaskTableColumns.job_id} = ?
      AND ${JobTaskTableColumns.status_id} != ?
      `,
      [jobId, JobStatus.Complete]
    );
    this.logService.log(openTasks, 'JobQueueAccess.markJobCompleteOrFailed');
    if (openTasks.rows.length > 0) {
      const sql = ` 
      UPDATE ${JobTableConfig.tableName} 
      SET ${JobTableColumns.job_status_id} = ${JobStatus.Failed} WHERE ${
        JobTableConfig.keyFieldName
      } = ? `;
      const result = await accessContext.knex.raw(sql, [jobId]);
      this.logService.log(result, 'JobQueueAccess.updateJobStatus');
    } else {
      const sql = ` 
      UPDATE ${JobTableConfig.tableName} 
      SET ${JobTableColumns.job_status_id} = ${JobStatus.Complete} WHERE ${
        JobTableConfig.keyFieldName
      } = ? `;
      const result = await accessContext.knex.raw(sql, [jobId]);
      this.logService.log(result, 'JobQueueAccess.updateJobStatus');
    }
  }

  async getJobQueueItem<T>(
    jobId: string,
    accessContext: AccessContext
  ): Promise<JobQueueTable<T>[]> {
    const result = await accessContext.knex.raw(
      `DELETE FROM ${JobQueueTableConfig.tableName}
      OUTPUT DELETED.* 
       WHERE ${JobQueueTableConfig.keyFieldName} = (
        SELECT ${JobQueueTableConfig.keyFieldName}
        FROM  ${JobQueueTableConfig.tableName}
        WHERE  ${JobQueueTableColumns.job_id} = ?
        ORDER BY ${JobQueueTableConfig.keyFieldName}
        FOR UPDATE SKIP LOCKED
        LIMIT 1
      );`,
      [jobId]
    );
    this.logService.log(result, 'JobQueueAccess.getJob');
    return result.rows as JobQueueTable<T>[];
  }

  async addAll<T extends BaseDocument>(
    messageType: string,
    jobId: string,
    docs: T[],
    accessContext: AccessContext
  ): Promise<any> {
    return await GenericAccessUtil.addAll(
      accessContext,
      docs,
      JobQueueTableConfig,
      {
        [JobQueueTableColumns.message_type]: messageType,
        [JobQueueTableColumns.job_id]: jobId
      }
    );
  }

  async add<T extends BaseDocument>(
    messageType: string,
    jobId: string,
    jobTaskId: string,
    doc: T,
    accessContext: AccessContext
  ): Promise<T> {
    return await GenericAccessUtil.add(
      accessContext,
      doc,
      JobQueueTableConfig,
      {
        [JobQueueTableColumns.message_type]: messageType,
        [JobQueueTableColumns.job_id]: jobId,
        [JobQueueTableColumns.job_task_id]: jobTaskId
      }
    );
  }

  async delete(doc: BaseDocument, accessContext: AccessContext): Promise<void> {
    return await GenericAccessUtil.physical_delete(
      accessContext,
      JobQueueTableConfig,
      {}
    );
  }

  async get(id: string, accessContext: AccessContext): Promise<BaseDocument> {
    return await GenericAccessUtil.get(accessContext, id, JobQueueTableConfig);
  }
}
