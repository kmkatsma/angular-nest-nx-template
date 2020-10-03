import { IModel, ITableConfig, BaseTable } from '@ocw/api-core';

export const AuditEventHistoryTableConfig: ITableConfig = {
  description: 'AuditEventHistory',
  tableName: 'audit_event_history',
  keyFieldName: 'audit_event_history_id'
};

export enum AuditEventHistoryTableColumns {
  document_id = 'document_id',
  document_enum_id = 'document_enum_id',
  event_date = 'event_date',
  event_type_id = 'event_type_id',
  year = 'year'
}

//aggregate events per year
export class AuditEventHistoryTable<T> extends BaseTable {
  audit_event_history_id: number;
  document_id: number;
  document_enum_id: number;
  event_type_id: number;
  event_date: number;
  year: number;
}
