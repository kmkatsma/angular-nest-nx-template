import { UserInfoAttribute } from '@ocw/shared-models';
import { ITableConfig, IModel } from '../db-models';

export enum TestUserTableColumns {
  user_id = 'user_id',
  email_address = 'email_address',
  org_location_id = 'org_location_id',
}

export const TestUserTableColumnMap = {
  [UserInfoAttribute.userId]: TestUserTableColumns.user_id,
  [UserInfoAttribute.emailAddress]: TestUserTableColumns.email_address,
  [UserInfoAttribute.locationId]: TestUserTableColumns.org_location_id,
};

export const TestUserInfoTableConfig: ITableConfig = {
  description: 'User Info',
  tableName: 'user_info',
  keyFieldName: 'user_sequence_id',
  columnsMap: TestUserTableColumnMap,
  documentAttributes: UserInfoAttribute,
};

export interface TestUserInfoTable extends IModel {
  email_address: string;
  org_location_id: number;
  user_sequence_id: number;
  user_id: string;
  json_document: any;
  tenant_id: number;
  row_version: number;
  is_deleted: boolean;
}
