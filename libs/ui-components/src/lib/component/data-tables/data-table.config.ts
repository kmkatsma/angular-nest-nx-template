import { ColumnDefinition, BaseDocument } from '@ocw/shared-models';

export class DataTableAction {
  data: any;
  action: string;
}
export class DataTableProperties {
  listParentId: string;
  listEnum: number;
  resourceEnum: number;
  resourceName: string;
  columns: ColumnDefinition[];
  class: string;
  title: string;
}

export interface DataTableRow<T> {
  document: T;
}
