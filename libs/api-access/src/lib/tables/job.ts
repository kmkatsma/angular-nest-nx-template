import { IModel, ITableConfig } from '@ocw/api-core';

export const JobTableConfig: ITableConfig = {
  description: 'Job',
  tableName: 'job',
  keyFieldName: 'job_id'
};

export enum JobTableColumns {
  job_id = 'job_id',
  job_type_id = 'job_type_id',
  job_subtype_id = 'job_subtype_id',
  job_status_id = 'job_status_id',
  start_dt = 'start_dt',
  end_dt = 'end_dt'
}

export class JobTable<T> implements IModel {
  job_id: number;
  job_type_id: number;
  job_status_id: number;
  job_subtype_id: number;
  json_document: T;
  tenant_id: number;
  row_version: number;
  is_deleted: boolean;
  start_dt: number;
  end_dt: number;
}
