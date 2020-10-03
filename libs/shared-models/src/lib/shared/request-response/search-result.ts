import { BaseDomainKeyEnum } from '../configuration/domains';

type buttonFieldFunction = (arg: any) => string;

export class ColumnDefinition {
  cdkColumnDef: string;
  cdkHeaderCellDef: string;
  fieldName: string;
  action?: (arg: any) => string;
  dataType: ColumnDataType;
  enumMap?: Map<number, string>;
  domainEnum?: string;
  domainAttribute?: string;
  arrayIndex?: number;
  arrayPropertyName?: string;
  hideXs? = false;
  hideSm? = false;
  hideMd? = false;
  hideLg? = false;
  hideAll? = false;
  style? = {};
}

export enum ColumnDataType {
  Coalesced = 'Coalesced',
  Note = 'note',
  SystemDate = 'SystemDate',
  TimestampDate = 'Timestamp',
  SystemDateTime = 'SystemDateTime',
  ReferenceValue = 'ReferenceValue',
  Boolean = 'Boolean',
  Currency = 'Currency',
  Date = 'Date',
  Count = 'count',
  EnumMap = 'EnumMap',
  string = 'string',
  Domain = 'Domain',
  DomainList = 'DomainList',
  Button = 'Button',
  number = 'number',
  Integer = 'integer',
  ArrayElement = 'ArrayElement',
  OptionsMenu = 'OptionsMenu',
  Icon = 'icon',
  Object = 'Object',
  DurationDays = 'DurationDays',
}
