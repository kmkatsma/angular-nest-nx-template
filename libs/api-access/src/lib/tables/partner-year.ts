import { IModel, ITableConfig } from '@ocw/api-core';

export const PartnerYearTableConfig: ITableConfig = {
  description: 'PartnerYear',
  tableName: 'partner_year',
  keyFieldName: 'partner_year_id',
};

export enum PartnerYearColumns {
  partner_id = 'partner_id',
  year = 'year',
  start_dt = 'start_dt',
}

export class PartnerYearTable implements IModel {
  partner_year_id: number;
  partner_id: number;
  year: number;
  start_dt: number;
  json_document: any;
  tenant_id: number;
  row_version: number;
  is_deleted: boolean;
}
