import { BaseDocument } from '../../base-models';

export enum TenantAttribute {
  tenantName = 'tenantName',
  domainName = 'domainName',
  features = 'features',
  isDeleted = 'isDeleted',
  tenantState = 'tenantState',
}

export class TenantDocument extends BaseDocument {
  [TenantAttribute.tenantName]: string;
  [TenantAttribute.domainName]: string;
  [TenantAttribute.tenantState]: string;
  [TenantAttribute.isDeleted]: boolean;
  [TenantAttribute.features]: number[] = [];
}
