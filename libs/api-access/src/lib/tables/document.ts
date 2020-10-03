import { IModel, ITableConfig } from '@ocw/api-core';
import { DocumentInfo } from '@ocw/shared-models';

export const DocumentTableConfig: ITableConfig = {
  description: 'Document',
  tableName: 'document',
  keyFieldName: 'document_id'
};

export enum DocumentColumns {
  object_id = 'object_id',
  object_type_id = 'object_type_id',
  document_type_id = 'document_type_id',
  document_content = 'document_content'
}

export class DocumentTable implements IModel {
  document_id: number;
  json_document: DocumentInfo;
  tenant_id: number;
  row_version: number;
  is_deleted: boolean;
  document_content: any;
}
