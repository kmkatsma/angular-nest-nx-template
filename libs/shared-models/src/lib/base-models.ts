export interface IsActive {
  isActive: boolean;
}

export class AuditBase {
  public auditInfo?: AuditInfo;
}

export enum AuditInfoAttribute {
  auditInfo = 'auditInfo',
}

export enum AuditInfoField {
  crtTs = 'crtTs',
  updTs = 'updTs',
  delTs = 'delTs',
  crtBy = 'crtBy',
  updBy = 'updBy',
  delBy = 'delBy',
}

export class AuditInfo {
  public [AuditInfoField.crtTs]: number;
  public [AuditInfoField.updTs]: number;
  public [AuditInfoField.delTs]: number;
  public [AuditInfoField.crtBy]: string;
  public [AuditInfoField.updBy]: string;
  public [AuditInfoField.delBy]: string;
}

export class BaseElement extends AuditBase {
  public id: string;
}

export enum BaseDocumentField {
  id = 'id',
  eTag = '_etag',
  partitionId = 'partitionId',
  searchType = 'searchType',
  rowVersion = 'rowVersion',
  auditInfo = 'auditInfo',
}

export class BaseDocument extends AuditBase {
  id: string;
  _eTag?: string;
  partitionId?: string;
  searchType?: string;
  rowVersion?: number;
}

export class BaseSearchResult<T> {
  public [BaseDocumentField.id]: string;
  public document: T;
}

export class SystemDate {
  public ts: number;

  public constructor(date: Date) {
    if (date) {
      const dateObj = new Date(date);
      this.ts = Math.round(
        Number(dateObj.setMinutes(dateObj.getTimezoneOffset() * -1)) / 1000
      );
    }
  }
}
