import { IModel, ITableConfig } from '@ocw/api-core';

export const JobQueueTableConfig: ITableConfig = {
  description: 'JobQueue',
  tableName: 'job_queue',
  keyFieldName: 'job_queue_id'
};

export enum JobQueueTableColumns {
  message_type = 'message_type',
  job_id = 'job_id',
  job_task_id = 'job_task_id'
}

export class JobQueueTable<T> implements IModel {
  job_queue_id: number;
  job_task_id: number;
  job_id: number;
  message_type: string;
  json_document: T;
  tenant_id: number;
  row_version: number;
  is_deleted: boolean;
}
