import { BaseDocument } from '../../base-models';
import { ServiceRequest } from '../request-response/service-response';
import { RequestAction } from '../request-response/request-action';

export enum ObjectType {
  Constituent = 1,
  User = 2,
}

export enum DocumentInfoType {
  ConstituentImage = 1,
  Note = 2,
  ServiceReportCriteria = 3,
  DocumentTemplate = 4,
}

export enum DocumentInfoFields {
  objectId = 'objectId',
  objectTypeId = 'objectTypeId',
  documentTypeId = 'documentTypeId',
  content = 'content',
  notes = 'notes',
  name = 'name',
}

export class DocumentInfo extends BaseDocument {
  [DocumentInfoFields.objectId]: string;
  [DocumentInfoFields.objectTypeId]: number;
  [DocumentInfoFields.documentTypeId]: number;
  [DocumentInfoFields.content]: any;
  [DocumentInfoFields.notes]: string;
  [DocumentInfoFields.name]: string;
}

export class DocumentFilter {
  objectId: string;
  objectTypeId: number;
  documentTypeId: number;
  documentId: number;
}

export class SaveDocumentRequest extends ServiceRequest<DocumentInfo> {
  data: DocumentInfo = new DocumentInfo();
  action: RequestAction;
}

export class DocumentSearchRecord {
  [DocumentInfoFields.objectId]: string;
  [DocumentInfoFields.objectTypeId]: number;
  [DocumentInfoFields.documentTypeId]: number;
  [DocumentInfoFields.notes]: string;
  document: any;
  objectName: string;
}
