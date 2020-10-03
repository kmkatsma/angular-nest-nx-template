import { IModel, ITableConfig } from '../../database/db-models';

 

export enum ReferenceYearDataTableColumns {
  reference_group = 'reference_group',
  reference_type = 'reference_type',
  reference_year = 'reference_year'
}

export class ReferenceYearDataTable implements IModel {
  reference_data_id: number;
  reference_group: string;
  reference_type: string;
  reference_year: number;
  json_document: string;
  tenant_id: number;
  row_version: number;
  is_deleted: boolean;
}

export const ReferenceYearDataTableConfig: ITableConfig = {
  description: 'Reference Year Data',
  tableName: 'reference_year_data',
  keyFieldName: 'reference_year_data_id',
  table: new ReferenceYearDataTable()
};
