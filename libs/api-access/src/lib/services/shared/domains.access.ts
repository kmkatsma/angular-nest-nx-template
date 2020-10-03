import { BaseDocument } from '@ocw/shared-models';
import { Injectable, NotFoundException } from '@nestjs/common';

import {
  LogService,
  GenericAccessUtil,
  AccessContextFactory,
  ReferenceDataTableConfig,
  ReferenceDataTableColumns
} from '@ocw/api-core';

import { ReferenceItemAttribute } from '@ocw/shared-models';

@Injectable()
export class DomainsAccess {
  constructor(
    private readonly accessContextFactory: AccessContextFactory,
    private readonly logService: LogService
  ) {}

  async getYearDomains<T>(domainsIdRoot: string): Promise<T> {
    const date = new Date();
    let year = date.getFullYear();
    const month = date.getMonth();
    if (month < 6) {
      year--;
    }
    const startYear = year - 10;
    while (year > startYear) {
      const references = await GenericAccessUtil.getListForClause(
        this.accessContextFactory.getAccessContext(),
        ReferenceDataTableConfig,
        { key_name: domainsIdRoot + year }
      );
      if (references.length > 0) {
        return (references[0] as unknown) as T;
      } else {
        year--;
      }
    }
    throw new NotFoundException('Domains not found');
  }

  async getDomains<T>(domainsId: string): Promise<T[]> {
    const results = await this.getDomainsList(domainsId);
    return results as T[];
  }

  async getDomainsList(domainsId: string): Promise<any[]> {
    const references = await GenericAccessUtil.getListForClause(
      this.accessContextFactory.getAccessContext(),
      ReferenceDataTableConfig,
      { reference_group: domainsId },
      {
        [ReferenceDataTableColumns.reference_group]: [
          ReferenceItemAttribute.referenceGroup
        ],
        [ReferenceDataTableColumns.reference_type]: [
          ReferenceItemAttribute.referenceType
        ]
      }
    );
    if (references.length > 0) {
      return references;
    } else {
      throw new NotFoundException('Domains not found');
    }
  }

  async getDomainsAttributeList<T>(
    domainsId: string,
    attributeName: string
  ): Promise<T[]> {
    const references = await GenericAccessUtil.getListForClause(
      this.accessContextFactory.getAccessContext(),
      ReferenceDataTableConfig,
      { reference_group: domainsId, reference_type: attributeName }
    );
    if (references.length > 0) {
      return (references as unknown) as T[];
    } else {
      return []; // throw new NotFoundException('Domains not found');
    }
  }
}
