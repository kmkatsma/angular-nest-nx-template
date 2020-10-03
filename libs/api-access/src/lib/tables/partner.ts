import { IModel, ITableConfig } from '@ocw/api-core';

export const PartnerTableConfig: ITableConfig = {
  description: 'Partner',
  tableName: 'partner',
  keyFieldName: 'partner_id'
};

export class PartnerTable implements IModel {
  partner_id: number;
  json_document: any;
  tenant_id: number;
  is_active: boolean;
  row_version: number;
  is_deleted: boolean;
}
