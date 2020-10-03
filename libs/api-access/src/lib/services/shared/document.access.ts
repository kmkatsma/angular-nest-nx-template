import { Injectable } from '@nestjs/common';
import { BaseDocumentField, DocumentFilter } from '@ocw/shared-models';
import { DocumentInfo } from '@ocw/shared-models';
import {
  DocumentColumns,
  DocumentTableConfig,
  DocumentTable,
} from '../../tables/document';
import {
  LogService,
  AccessContext,
  GenericAccessUtil,
  IModelFields,
  AccessQueryFactory,
} from '@ocw/api-core';

@Injectable()
export class DocumentAccess {
  constructor(
    private readonly logService: LogService,
    private readonly accessQueryFactory: AccessQueryFactory
  ) {}

  async addOrReplaceDocument(doc: DocumentInfo, accessContext: AccessContext) {
    if (doc[BaseDocumentField.id]) {
      return await this.replace(doc, accessContext);
    } else {
      return await this.add(doc, accessContext);
    }
  }

  private async add(
    doc: DocumentInfo,
    accessContext: AccessContext
  ): Promise<DocumentInfo> {
    const content = doc.content;
    doc.content = null;
    return await GenericAccessUtil.add(
      accessContext,
      doc,
      DocumentTableConfig,
      {
        [DocumentColumns.object_id]: doc.objectId,
        [DocumentColumns.object_type_id]: doc.objectTypeId,
        [DocumentColumns.document_type_id]: doc.documentTypeId,
        [DocumentColumns.document_content]: content,
        is_deleted: false,
      }
    );
  }

  private async replace(
    doc: DocumentInfo,
    accessContext: AccessContext
  ): Promise<DocumentInfo> {
    const content = doc.content;
    doc.content = null;
    return await GenericAccessUtil.update(
      accessContext,
      doc,
      DocumentTableConfig,
      {
        [DocumentColumns.object_id]: doc.objectId,
        [DocumentColumns.object_type_id]: doc.objectTypeId,
        [DocumentColumns.document_type_id]: doc.documentTypeId,
        [DocumentColumns.document_content]: content,
        is_deleted: false,
      }
    );
  }

  async delete(
    doc: DocumentInfo,
    accessContext: AccessContext
  ): Promise<DocumentInfo> {
    return await GenericAccessUtil.update(
      accessContext,
      doc,
      DocumentTableConfig,
      {
        [IModelFields.is_deleted]: true,
      }
    );
  }

  async get(id: string, accessContext: AccessContext): Promise<DocumentInfo> {
    return await GenericAccessUtil.get(
      accessContext,
      id,
      DocumentTableConfig,
      [DocumentColumns.document_content],
      {
        [DocumentColumns.document_content]: 'content',
      }
    );
  }

  async search<T extends DocumentInfo>(
    request: DocumentFilter,
    accessContext: AccessContext
  ): Promise<T[]> {
    const accessQuery = this.accessQueryFactory.createQuery(
      DocumentTableConfig
    );

    if (request.documentTypeId) {
      accessQuery.addWhere(
        DocumentColumns.document_type_id,
        request.documentTypeId
      );
    }
    if (request.objectId) {
      accessQuery.addWhere(DocumentColumns.object_id, request.objectId);
    }
    if (request.objectTypeId) {
      accessQuery.addWhere(
        DocumentColumns.object_type_id,
        request.objectTypeId
      );
    }
    accessQuery.Columns.addColumn(DocumentColumns.document_content);
    const items = await accessQuery.select();
    //this.logService.log(items, 'items');
    return items.map((p: DocumentTable) => {
      return this.transformDocument(p, accessContext);
    }) as T[];
  }

  transformDocument(
    p: DocumentTable,
    accessContext: AccessContext
  ): DocumentInfo {
    const document: DocumentInfo = GenericAccessUtil.convertToObject(
      p,
      DocumentTableConfig.keyFieldName,
      accessContext
    );
    document.rowVersion = p.row_version;
    document.id = p.document_id.toString();
    document.content = p.document_content;
    return document;
  }
}
