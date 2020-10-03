import { BaseDocument } from '../../base-models';

export enum ImportFieldName {
  file = 'file',
  options = 'options',
  mode = 'mode',
}

export enum ImportStatus {
  Staged = 1,
  InProcess = 2,
  Complete = 3,
}

export const ImportStatusList = new Map<number, string>([
  [ImportStatus.Staged, 'Staged'],
  [ImportStatus.InProcess, 'In Process'],
  [ImportStatus.Complete, 'Complete'],
]);

export enum ImportDocumentAttribute {
  type = 'type',
  imported = 'imported',
  notImported = 'notImported',
  status = 'status',
}

export class ImportDocument extends BaseDocument {
  imported: number;
  notImported: number;
}

export class ImportRecordSearchRequest {
  importIdEquals: string;
  importTypeEquals: string;
  statusEquals: string;
}

export class ImportSearchRequest {
  startDt: number;
  endDate: number;
  importTypeEquals: number;
  importStatusEquals: ImportStatus;
}
