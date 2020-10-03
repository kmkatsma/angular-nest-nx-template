import { Injectable } from '@nestjs/common';
import {
  BaseDocumentField,
  AttributeValue,
  AttributeValueSearchRequest
} from '@ocw/shared-models';
import {
  LogService,
  AccessContext,
  GenericAccessUtil,
  IModelFields,
  AccessQueryNew,
  AccessQueryFactory,
  ComparisonType
} from '@ocw/api-core';
import {
  AttributeValueTableConfig,
  AttributeValueTableColumns,
  AttributeValueTable
} from '../../tables/attribute_value';

@Injectable()
export class AttributeValueAccess {
  constructor(
    private readonly logService: LogService,
    private readonly accessQueryFactory: AccessQueryFactory
  ) {}

  async addOrReplace<T>(doc: AttributeValue<T>, accessContext: AccessContext) {
    if (doc[BaseDocumentField.id]) {
      return await this.replace(doc, accessContext);
    } else {
      return await this.add(doc, accessContext);
    }
  }

  async addAll<T>(
    docs: AttributeValue<T>[],
    accessContext: AccessContext
  ): Promise<any[]> {
    return await GenericAccessUtil.addAll(
      accessContext,
      docs,
      AttributeValueTableConfig,
      {}
    );
  }

  private async add<T>(
    doc: AttributeValue<T>,
    accessContext: AccessContext
  ): Promise<AttributeValue<T>> {
    return await GenericAccessUtil.add(
      accessContext,
      doc,
      AttributeValueTableConfig,
      {
        [AttributeValueTableColumns.entity_id]: doc.entityId,
        [AttributeValueTableColumns.entity_type]: doc.entityType,
        [AttributeValueTableColumns.attribute_type]: doc.attributeType,
        is_deleted: false
      }
    );
  }

  private async replace<T>(
    doc: AttributeValue<T>,
    accessContext: AccessContext
  ): Promise<AttributeValue<T>> {
    return await GenericAccessUtil.update(
      accessContext,
      doc,
      AttributeValueTableConfig,
      {
        [AttributeValueTableColumns.entity_id]: doc.entityId,
        [AttributeValueTableColumns.entity_type]: doc.entityType,
        [AttributeValueTableColumns.attribute_type]: doc.attributeType,
        is_deleted: false
      }
    );
  }

  async delete<T>(
    doc: AttributeValue<T>,
    accessContext: AccessContext
  ): Promise<AttributeValue<T>> {
    return await GenericAccessUtil.update(
      accessContext,
      doc,
      AttributeValueTableConfig,
      {
        [IModelFields.is_deleted]: true
      }
    );
  }

  async get<T>(
    id: string,
    accessContext: AccessContext
  ): Promise<AttributeValue<T>> {
    return await GenericAccessUtil.get(
      accessContext,
      id,
      AttributeValueTableConfig
    );
  }

  async search<T>(
    request: AttributeValueSearchRequest,
    accessContext: AccessContext
  ): Promise<AttributeValue<T>[]> {
    const accessQuery = new AccessQueryNew(
      accessContext,
      AttributeValueTableConfig,
      this.logService
    );

    if (request.entityId) {
      accessQuery.addWhereClause({
        columnName: AttributeValueTableColumns.entity_id,
        values: [request.entityId],
        comparison: ComparisonType.Equals
      });
    }
    if (request.entityIdList && request.entityIdList.length > 0) {
      accessQuery.addWhereClause({
        columnName: AttributeValueTableColumns.entity_id,
        values: request.entityIdList,
        comparison: ComparisonType.In
      });
    }

    if (request.entityType) {
      accessQuery.addWhereClause({
        columnName: AttributeValueTableColumns.entity_type,
        values: [request.entityType],
        comparison: ComparisonType.Equals
      });
    }
    if (request.attributeType) {
      accessQuery.addWhereClause({
        columnName: AttributeValueTableColumns.attribute_type,
        values: [request.attributeType],
        comparison: ComparisonType.Equals
      });
    }

    accessQuery.addColumn({
      columnName: AttributeValueTableColumns.attribute_type
    });

    const items = await accessQuery.select();
    return items.map((p: AttributeValueTable) => {
      return this.transformDocument(p, accessContext);
    }) as AttributeValue<T>[];
  }

  transformDocument<T>(
    p: AttributeValueTable,
    accessContext: AccessContext
  ): AttributeValue<T> {
    const document: AttributeValue<T> = GenericAccessUtil.convertToObject(
      p,
      AttributeValueTableConfig.keyFieldName,
      accessContext
    );
    document.attributeType = p.attribute_type;
    document.rowVersion = p.row_version;
    document.id = p.attribute_value_id.toString();
    return document;
  }
}
