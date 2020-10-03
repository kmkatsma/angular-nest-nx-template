import { IModel, ITableConfig } from '../../database/db-models';

 
export enum ReferenceDataTableColumns {
  reference_group = 'reference_group',
  reference_type = 'reference_type'
}

export class ReferenceDataTable implements IModel {
  reference_data_id: number;
  reference_group: string;
  reference_type: string;
  json_document: string;
  tenant_id: number;
  row_version: number;
  is_deleted: boolean;
}

export const ReferenceDataTableConfig: ITableConfig = {
  description: 'Reference Data',
  tableName: 'reference_data',
  keyFieldName: 'reference_data_id',
  table: new ReferenceDataTable()
};
