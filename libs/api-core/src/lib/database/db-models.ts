export enum IModelFields {
  tenant_id = 'tenant_id',
  json_document = 'json_document',
  row_version = 'row_version',
  is_deleted = 'is_deleted'
}

export interface IModel {
  tenant_id?: number;
  json_document?: any;
  row_version?: number;
  is_deleted?: boolean;
}

export class BaseTable implements IModel {
  [IModelFields.tenant_id]: number;
  [IModelFields.json_document]: any;
  [IModelFields.row_version]: number;
  [IModelFields.is_deleted]: boolean;
}

export interface ITableConfig {
  tableName: string;
  keyFieldName: string;
  description: string;
  table?: IModel;
  columnsMap?: any;
  documentAttributes?: any;
  customId?: boolean;
}
