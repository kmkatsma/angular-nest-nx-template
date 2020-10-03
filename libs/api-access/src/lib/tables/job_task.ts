import { IModel, ITableConfig } from '@ocw/api-core';

export const JobTaskTableConfig: ITableConfig = {
  description: 'JobTask',
  tableName: 'job_task',
  keyFieldName: 'job_task_id'
};

export enum JobTaskTableColumns {
  message_type = 'message_type',
  job_id = 'job_id',
  status_id = 'status_id',
  attempts = 'attempts'
}

export class JobTaskTable<T> implements IModel {
  job_task_id: number;
  job_id: number;
  status_id: number;
  message_type: string;
  json_document: T;
  tenant_id: number;
  row_version: number;
  is_deleted: boolean;
  attempts: number;
}
