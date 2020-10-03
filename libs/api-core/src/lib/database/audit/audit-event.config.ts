import { ITableConfig, BaseTable, IModel } from '../db-models';

export enum AuditEventType {
  insert = 'insert',
  update = 'update',
  logical_delete = 'logical_delete',
  physical_delete = 'physical_delete'
}

export enum AuditEventTableColumns {
  table_row_id = 'table_row_id',
  table_name = 'table_name',
  event_date = 'event_date',
  event_type = 'event_type',
  user_id = 'user_id'
}

export interface AuditEvent extends IModel {
  [AuditEventTableColumns.table_row_id]?: number;
  [AuditEventTableColumns.table_name]?: string;
  [AuditEventTableColumns.event_type]?: AuditEventType;
  [AuditEventTableColumns.event_date]?: number;
  [AuditEventTableColumns.user_id]?: string;
}

export class AuditEventTable extends BaseTable {
  audit_event_id?: number;
  [AuditEventTableColumns.table_row_id]: number;
  [AuditEventTableColumns.table_name]: string;
  [AuditEventTableColumns.event_type]: AuditEventType;
  [AuditEventTableColumns.event_date]: number;
  [AuditEventTableColumns.user_id]: string;
}

export const AuditEventTableConfig: ITableConfig = {
  description: 'Audit',
  tableName: 'audit_event',
  keyFieldName: 'audit_event_id',
  table: new AuditEventTable()
};
