import {
  AuditEventSearchRecordField,
  ColumnDataType,
  ColumnDefinition
} from '@ocw/shared-models';

export enum DiffFields {
  kind = 'kind',
  path = 'path',
  lhs = 'lhs',
  rhs = 'rhs',
  index = 'index',
  item = 'item'
}

export interface DiffNew<RHS> {
  kind: 'N';
  path?: any[];
  rhs: RHS;
}

export interface DiffDeleted<LHS> {
  kind: 'D';
  path?: any[];
  lhs: LHS;
}

export interface DiffEdit<LHS, RHS = LHS> {
  kind: 'E';
  path?: any[];
  lhs: LHS;
  rhs: RHS;
}

export interface DiffArray<LHS, RHS = LHS> {
  kind: 'A';
  path?: any[];
  index: number;
  item: Diff<LHS, RHS>;
}

export enum ChangeEntryField {
  type = 'type',
  details = 'details'
}

export class ChangeEntry {
  type: string;
  details: string;
}

export type Diff<LHS, RHS = LHS> =
  | DiffNew<RHS>
  | DiffDeleted<LHS>
  | DiffEdit<LHS, RHS>
  | DiffArray<LHS, RHS>;

export const changeColumns: ColumnDefinition[] = [
  {
    cdkColumnDef: `${AuditEventSearchRecordField.userName}`,
    cdkHeaderCellDef: 'Update User',
    dataType: ColumnDataType.string,
    fieldName: `${AuditEventSearchRecordField.userName}`
  },
  {
    cdkColumnDef: `${AuditEventSearchRecordField.eventDate}`,
    cdkHeaderCellDef: 'Update Date',
    dataType: ColumnDataType.SystemDateTime,
    fieldName: `${AuditEventSearchRecordField.eventDate}`
  },
  {
    cdkColumnDef: `${AuditEventSearchRecordField.diff}`,
    cdkHeaderCellDef: 'Changes',
    dataType: ColumnDataType.Count,
    fieldName: `${AuditEventSearchRecordField.diff}`
  }
];

export const changeDetailColumns: ColumnDefinition[] = [
  {
    cdkColumnDef: `${ChangeEntryField.type}`,
    cdkHeaderCellDef: 'Type',
    dataType: ColumnDataType.string,
    fieldName: `${ChangeEntryField.type}`
  },
  {
    cdkColumnDef: `${ChangeEntryField.details}`,
    cdkHeaderCellDef: 'Details',
    dataType: ColumnDataType.string,
    fieldName: `${ChangeEntryField.details}`
  }
];
