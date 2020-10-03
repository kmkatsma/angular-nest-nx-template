import { Injectable } from '@nestjs/common';
import {
  AccessContext,
  GenericAccessUtil,
  LogService,
  IModelFields
} from '@ocw/api-core';
import { BaseDocument } from '@ocw/shared-models';
import { ImportDocument, ImportStatus, JobStatus } from '@ocw/shared-models';
import {
  JobTaskTable,
  JobTaskTableColumns,
  JobTaskTableConfig
} from '../../../tables/job_task';
import { JobQueueAccess } from './job-queue.access';
import {
  JobQueueTableConfig,
  JobQueueTableColumns
} from '../../../tables/job_queue';

@Injectable()
export class JobTaskAccess {
  constructor(private readonly logService: LogService) {}

  async markTaskComplete(
    jobTaskId: string,
    accessContext: AccessContext
  ): Promise<void> {
    const sql = ` 
    UPDATE ${JobTaskTableConfig.tableName} set ${JobTaskTableColumns.attempts} = ${JobTaskTableColumns.attempts} + 1, ${JobTaskTableColumns.status_id} = ? WHERE ${JobTaskTableConfig.keyFieldName} = ? `;
    const result = await accessContext.knex.raw(sql, [
      ImportStatus.Complete,
      jobTaskId
    ]);
    this.logService.log(result, 'JobTaskAccess.markTaskComplete');
  }

  async markTaskAttempted(
    jobTaskId: string,
    accessContext: AccessContext
  ): Promise<number> {
    const sql = ` 
  UPDATE ${JobTaskTableConfig.tableName}
    SET ${JobTaskTableColumns.status_id} = 
      CASE WHEN ${JobTaskTableColumns.attempts} < 5  
        THEN ${JobStatus.InProcess}
        ELSE  ${JobStatus.Failed}
      END
    , ${JobTaskTableColumns.attempts} = ${JobTaskTableColumns.attempts} + 1
    OUTPUT INSERTED.${JobTaskTableColumns.attempts}
    WHERE ${JobTaskTableConfig.keyFieldName} = ? `;
    const result = await accessContext.knex.raw(sql, [jobTaskId]);
    this.logService.log(result, 'JobTaskAccess.markTaskAttempted');
    return result.rows[0][JobTaskTableColumns.attempts];
  }

  async addAll<T extends BaseDocument>(
    messageType: string,
    jobId: string,
    docs: T[],
    accessContext: AccessContext
  ): Promise<void> {
    const results = await GenericAccessUtil.addAll<T, JobTaskTable<T>>(
      accessContext,
      docs,
      JobTaskTableConfig,
      {
        [JobTaskTableColumns.message_type]: messageType,
        [JobTaskTableColumns.attempts]: 0,
        [JobTaskTableColumns.status_id]: JobStatus.Staged,
        [JobTaskTableColumns.job_id]: jobId
      }
    );
    console.log('addAll Results', results);
    /*await GenericAccessUtil.addAll(
      accessContext,
      results,
      JobQueueTableConfig,
      {
        [JobQueueTableColumns.message_type]: messageType,
        [JobQueueTableColumns.job_id]: jobId
      },
    );*/
  }

  async add<T extends BaseDocument>(
    messageType: string,
    jobId: string,
    doc: T,
    accessContext: AccessContext
  ): Promise<T> {
    return await GenericAccessUtil.add(accessContext, doc, JobTaskTableConfig, {
      [JobTaskTableColumns.message_type]: messageType,
      [JobTaskTableColumns.attempts]: 0,
      [JobTaskTableColumns.status_id]: JobStatus.Staged,
      [JobTaskTableColumns.job_id]: jobId
    });
  }

  async delete(
    doc: ImportDocument,
    accessContext: AccessContext
  ): Promise<void> {
    return await GenericAccessUtil.physical_delete(
      accessContext,
      JobTaskTableConfig,
      {}
    );
  }

  async get(id: string, accessContext: AccessContext): Promise<BaseDocument> {
    return await GenericAccessUtil.get(accessContext, id, JobTaskTableConfig);
  }
}
