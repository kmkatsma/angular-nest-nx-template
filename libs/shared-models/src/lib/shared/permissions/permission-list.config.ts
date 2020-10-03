import {
  ColumnDefinition,
  ColumnDataType,
} from '../request-response/search-result';
import {
  ReferenceValueAttribute,
  ReferenceItemAttribute,
} from '../reference-base';
import { AppMenuItemField } from '../configuration/system';
import { BaseDocumentField } from '../../base-models';
import { BaseDomainKeyEnum } from '../configuration/domains';
import { SystemReferenceType } from '../configuration/system-reference';

export const permissionColumns: ColumnDefinition[] = [
  {
    cdkColumnDef: `${ReferenceValueAttribute.val}`,
    cdkHeaderCellDef: 'Name',
    dataType: ColumnDataType.string,
    fieldName: `${ReferenceValueAttribute.val}`,
  },
  {
    cdkColumnDef: `description`,
    cdkHeaderCellDef: 'Description',
    dataType: ColumnDataType.string,
    fieldName: `description`,
  },
  {
    cdkColumnDef: `${AppMenuItemField.allowedRoles}`,
    cdkHeaderCellDef: 'Access Filters',
    dataType: ColumnDataType.DomainList,
    domainEnum: BaseDomainKeyEnum.System,
    domainAttribute: SystemReferenceType.roles,
    fieldName: `${AppMenuItemField.allowedRoles}`,
  },
  {
    cdkColumnDef: `${BaseDocumentField.id}`,
    cdkHeaderCellDef: 'Id',
    dataType: ColumnDataType.string,
    fieldName: `${BaseDocumentField.id}`,
    hideAll: true,
  },
  {
    cdkColumnDef: `${ReferenceValueAttribute.uid}`,
    cdkHeaderCellDef: 'Uid',
    dataType: ColumnDataType.string,
    fieldName: `${ReferenceValueAttribute.uid}`,
    hideAll: true,
  },
];
