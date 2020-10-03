import { IsDefined } from 'class-validator';

export enum UserActionAuditField {
  actionDate = 'actionDate',
  actionBy = 'actionBy',
  actionType = 'actionType',
  description = 'description'
}

export class UserActionAudit {
  [UserActionAuditField.actionBy]: string;
  [UserActionAuditField.actionDate]: number;
  [UserActionAuditField.actionType]: number;
  [UserActionAuditField.description]: string;
}

export enum AuditEventSearchRequestField {
  tableName = 'tableName',
  objectId = 'objectId',
  startDate = 'startDate',
  endDate = 'endDate'
}

export class AuditEventSearchRequest {
  @IsDefined()
  tableName: string;
  @IsDefined()
  objectId: string;
  buildDiff = false;
  startDate: number;
  endDate: number;
}

export enum AuditEventSearchRecordField {
  objectId = 'objectId',
  tableName = 'tableName',
  eventDate = 'eventDate',
  eventType = 'eventType',
  document = 'document',
  userName = 'userName',
  diff = 'diff'
}

export class AuditEventSearchRecord {
  objectId: string;
  tableName: string;
  eventDate: number;
  eventType: string;
  document: object;
  userName: string;
  diff: any[];
}
