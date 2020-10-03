import { ColumnDefinition } from '@ocw/shared-models';

export class ListControlConfig {
  listEnum: string;
  resourceEnum: number;
  resourceName: string;
  columns: ColumnDefinition[];
  class: string;
  title: string;
}

export class ListSelectedEvent {
  constructor(public searchEnum: number, public resourcEnum: number) {}
}
