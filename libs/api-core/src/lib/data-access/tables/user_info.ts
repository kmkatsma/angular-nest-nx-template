import { IModel, ITableConfig } from '../../database/db-models';
import { UserInfoAttribute } from '@ocw/shared-models';

export enum UserTableColumns {
  user_id = 'user_id',
  email_address = 'email_address',
  org_location_id = 'org_location_id',
  profile_json_document = 'profile_json_document',
  start_date = 'start_date',
  end_date = 'end_date',
}

export const UserTableColumnMap = {
  [UserInfoAttribute.userId]: UserTableColumns.user_id,
  [UserInfoAttribute.emailAddress]: UserTableColumns.email_address,
  [UserInfoAttribute.locationId]: UserTableColumns.org_location_id,
  [UserInfoAttribute.startDate]: UserTableColumns.start_date,
  [UserInfoAttribute.endDate]: UserTableColumns.end_date,
};

export const UserInfoTableConfig: ITableConfig = {
  description: 'User Info',
  tableName: 'user_info',
  keyFieldName: 'user_sequence_id',
  columnsMap: UserTableColumnMap,
  documentAttributes: UserInfoAttribute,
};

export interface UserInfoTable extends IModel {
  email_address: string;
  org_location_id: number;
  start_date: number;
  end_date: number;
  user_sequence_id: number;
  user_id: string;
  json_document: any;
  profile_json_document: any;
  tenant_id: number;
  row_version: number;
  is_deleted: boolean;
}

export enum UserwithTenantFields {
  tenant_state = 'tenant_state',
  tenant_json = 'tenant_json',
}

export interface UserWithTenant extends UserInfoTable {
  tenant_state: string;
  tenant_json: string;
  provider_id: string;
}
