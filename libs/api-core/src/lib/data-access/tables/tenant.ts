import { ITableConfig, IModel } from '../../database/db-models';

export const TenantTableConfig: ITableConfig = {
  description: 'Tenant',
  tableName: 'tenant',
  keyFieldName: 'tenant_id',
};

export class TenantTable implements IModel {
  tenant_id: number;
  tenant_name: string;
  domain_name: string;
  json_document: any;
  row_version: number;
  is_deleted: boolean;
  tenant_state: string;
}

export enum TenantTableColumns {
  tenant_name = 'tenant_name',
  domain_name = 'domain_name',
  tenant_state = 'tenant_state',
}
