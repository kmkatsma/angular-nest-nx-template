import { IModel, ITableConfig } from '@ocw/api-core';
import { DocumentInfo, AttributeValueFields } from '@ocw/shared-models';

export enum AttributeValueTableColumns {
  entity_id = 'entity_id',
  entity_type = 'entity_type',
  attribute_type = 'attribute_type'
}

export const attributeValueTableColumnMap = {
  [AttributeValueFields.entityId]: AttributeValueTableColumns.entity_id,
  [AttributeValueFields.entityType]: AttributeValueTableColumns.entity_type,
  [AttributeValueFields.attributeType]:
    AttributeValueTableColumns.attribute_type
};

export const AttributeValueTableConfig: ITableConfig = {
  description: 'Attribute Value',
  tableName: 'attribute_value',
  keyFieldName: 'attribute_value_id',
  columnsMap: attributeValueTableColumnMap,
  documentAttributes: AttributeValueFields
};

export class AttributeValueTable implements IModel {
  attribute_value_id: number;
  entity_id: number;
  entity_type: number;
  attribute_type: string;
  json_document: DocumentInfo;
  tenant_id: number;
  row_version: number;
  is_deleted: boolean;
  document_content: any;
}
