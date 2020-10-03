import {
  AppMenuItem,
  PermissionItem,
  SystemRole,
  SystemFeature,
  PermissionField,
} from './system';
import { BaseDocumentField, BaseDocument } from '../../base-models';
import { ReferenceEntityField } from './attribute-reference';
import {
  ReferenceAttributeType,
  BaseDomainKeyEnum,
  BaseDomainEnum,
} from './domains';

export class BaseSystemReferenceData extends BaseDocument {}

export enum SystemReferenceType {
  homeMenu = 'homeMenu',
  homePermissions = 'homePermissions',
  adminMenu = 'adminMenu',
  roles = 'roles',
  permissions = 'permissions',
  features = 'features',
}

export class SystemReferenceData extends BaseSystemReferenceData {
  [SystemReferenceType.homeMenu]: AppMenuItem[] = [];
  [SystemReferenceType.homePermissions]: PermissionItem[] = [];
  [SystemReferenceType.adminMenu]: AppMenuItem[] = [];
  [SystemReferenceType.roles]: SystemRole[] = [];
  [SystemReferenceType.permissions]: PermissionItem[] = [];
  [SystemReferenceType.features]: SystemFeature[] = [];

  constructor() {
    super();
    this[BaseDocumentField.partitionId] = 'SystemReferenceData';
  }
}

export const systemReferenceDataValidations = {
  [SystemReferenceType.homeMenu]: {
    typedInstance: new AppMenuItem(),
  },
  [SystemReferenceType.homePermissions]: {
    typedInstance: new PermissionItem(),
  },
  [SystemReferenceType.roles]: {
    typedInstance: new SystemRole(),
  },
  [SystemReferenceType.permissions]: {
    typedInstance: new PermissionItem(),
  },
  [SystemReferenceType.features]: {
    typedInstance: new SystemFeature(),
  },
};

export const allowedRolesField = () => {
  const field = new ReferenceEntityField();
  field.attributeName = PermissionField.allowedRoles;
  field.placeHolder = 'Access Filters';
  field.attributeType = ReferenceAttributeType.MultiSelect;
  field.domainKey = BaseDomainKeyEnum.System;
  field.domainAttributeName = SystemReferenceType.roles;
  field.domainEnum = BaseDomainEnum.SystemReference;
  return field;
};
