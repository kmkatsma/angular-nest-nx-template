import { ReferenceItem } from '../reference-base';

export enum PermissionField {
  allowedRoles = 'allowedRoles',
}

export enum AppMenuItemField {
  icon = 'icon',
  allowedRoles = 'allowedRoles',
  permissions = 'permissions',
  tooltip = 'tooltip',
  route = 'route',
  subMenu = 'subMenu',
  writeRoles = 'writeRoles',
}

export interface PermissionedItem {
  allowedRoles: number[];
  tenantFeatureId?: number;
}

export class PermissionItem extends ReferenceItem implements PermissionedItem {
  allowedRoles: number[];
  description: string;

  constructor(
    uid?: number,
    val?: string,
    description?: string,
    allowedRoles?: number[]
  ) {
    super(uid, val);
    this.description = description;
    this.allowedRoles = allowedRoles;
  }
}

export interface TabMenuItem {
  label: string;
  type?: any;
  icon: string;
  toolTip?: string;
  route?: string;
  subMenu?: TabMenuItem[];
  active?: any;
  errors?: number;
}

export class AppMenuItem extends ReferenceItem
  implements PermissionedItem, TabMenuItem {
  label: string;
  type?: any;
  icon: string;
  toolTip: string;
  route: string;
  subMenu: AppMenuItem[] = [];
  allowedRoles: number[] = [];
  writeRoles: number[] = [];
  permissions: PermissionItem[] = [];
  permissionId?: number;
  errors?: number;
  tenantFeatureId?: number;
}

export class SystemRole extends ReferenceItem {
  isCustom = false;
}

export class SystemFeature extends ReferenceItem {}
