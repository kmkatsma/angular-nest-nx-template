import { IModel, ITableConfig } from '../../database/db-models';


export enum CacheEntryTableColumns {
  cache_key = 'cache_key',
  expired_timestamp = 'expired_timestamp'
}

export class CacheEntryTable implements IModel {
  cache_entry_id: number;
  cache_key: string;
  expired_timestamp: number;
  json_document: string;
  tenant_id: number;
  row_version: number;
  is_deleted: boolean;
}

export const CacheEntryTableConfig: ITableConfig = {
  description: 'Cache Entry Data',
  tableName: 'cache_entry',
  keyFieldName: 'cache_entry_id',
  table: new CacheEntryTable()
};
