import {
  NoteDocumentFields,
  ColumnDataType,
  ColumnDefinition
} from '@ocw/shared-models';
import {
  BaseDocumentField,
  AuditInfoAttribute,
  AuditInfoField
} from '@ocw/shared-models';

export const noteColumns: ColumnDefinition[] = [
  {
    cdkColumnDef: 'notes',
    cdkHeaderCellDef: 'Notes',
    dataType: ColumnDataType.string,
    fieldName: `${NoteDocumentFields.notes}`
  },
  {
    cdkColumnDef: 'Case_UpdateUser',
    cdkHeaderCellDef: 'Update User',
    dataType: ColumnDataType.string,
    fieldName: `${AuditInfoAttribute.auditInfo}.${AuditInfoField.updBy}`
  },
  {
    cdkColumnDef: 'Case_UpdateDate',
    cdkHeaderCellDef: 'Update Date',
    dataType: ColumnDataType.TimestampDate,
    fieldName: `${AuditInfoAttribute.auditInfo}.${AuditInfoField.updTs}`
  },
  {
    cdkColumnDef: 'Id',
    cdkHeaderCellDef: 'Id',
    dataType: ColumnDataType.string,
    fieldName: `${BaseDocumentField.id}`,
    hideAll: true
  }
];
