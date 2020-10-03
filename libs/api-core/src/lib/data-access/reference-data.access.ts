import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ReferenceItemAttribute,
  ReferenceItem,
  ReferenceDataGroup
} from '@ocw/shared-models';
import { CacheUtil } from './cache.service';
import {
  ReferenceDataTableConfig,
  ReferenceDataTableColumns
} from './tables/reference_data';
import { LogService } from '../logging/log.service';
import { GenericAccessUtil } from '../database/generic.access';
import { AccessContextFactory } from '../database/access-context-factory';

@Injectable()
export class ReferenceDataAccess {
  constructor(
    private readonly accessContextFactory: AccessContextFactory,
    private readonly logService: LogService,
    private readonly cacheService: CacheUtil
  ) {}

  private buildReferenceKey(domainsId: string, attribute: string) {
    return domainsId + attribute;
  }

  async getReferenceDataGroup<T>(domainsId: string): Promise<T> {
    const results = await this.loadReferenceDataGroup(domainsId);
    const domains = await this.convertToDomainsReference(results);
    return domains.results;
  }

  clearCache(domainsId: string, attribute: string) {
    this.cacheService.delete(domainsId);
    const key = this.buildReferenceKey(domainsId, attribute);
    this.cacheService.delete(key);
  }

  async getReferenceDataType<T>(
    domainsId: string,
    attribute: string,
    options?: { skipException?: boolean }
  ): Promise<Map<string | number, T>> {
    const key = this.buildReferenceKey(domainsId, attribute);
    const map = this.cacheService.get(key);
    if (map) {
      return map as Map<string | number, T>;
    }

    const results = await this.loadReferenceDataType(
      domainsId,
      attribute,
      options
    );
    const mapResult = await this.convertToReferenceMap('uid', results);
    this.cacheService.set(key, mapResult);
    return mapResult;
  }

  public async loadReferenceDataGroup(domainsId: string): Promise<any[]> {
    const map = this.cacheService.get(domainsId);
    if (map) {
      return map as any[];
    }
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
      this.cacheService.set(domainsId, references);
      return references;
    } else {
      throw new NotFoundException('Domains not found');
    }
  }

  private async loadReferenceDataType(
    domainsId: string,
    attribute: string,
    options?: { skipException?: boolean }
  ): Promise<any[]> {
    const references = await GenericAccessUtil.getListForClause(
      this.accessContextFactory.getAccessContext(),
      ReferenceDataTableConfig,
      { reference_group: domainsId, reference_type: attribute },
      {
        [ReferenceDataTableColumns.reference_group]: [
          ReferenceItemAttribute.referenceGroup
        ],
        [ReferenceDataTableColumns.reference_type]: [
          ReferenceItemAttribute.referenceType
        ]
      }
    );
    if (references.length > 0 || options?.skipException) {
      return references;
    } else {
      throw new NotFoundException('Domains not found');
    }
  }

  async convertToDomainsReference(
    data: ReferenceItem[]
  ): Promise<ReferenceDataGroup> {
    const domainGroup = {};
    const domainGroupMap = new Map<
      string,
      Map<string | number, ReferenceItem>
    >();
    if (data && data.length) {
      let domainTypeMap = new Map<string | number, ReferenceItem>();
      for (let i = 0; i < data.length; i++) {
        if (data[i]) {
          const entry: ReferenceItem = data[i];
          domainTypeMap = domainGroupMap.get(
            entry[ReferenceItemAttribute.referenceType]
          );
          if (!domainTypeMap) {
            domainTypeMap = new Map<string | number, ReferenceItem>();
            domainGroupMap.set(entry.referenceType, domainTypeMap);
            domainGroup[entry.referenceType] = [];
          }
          domainGroup[entry.referenceType].push(entry);
          if (entry.referenceType.endsWith('Document')) {
            domainTypeMap.set(entry['id'], entry);
          } else {
            domainTypeMap.set(entry['uid'], entry);
          }
        }
      }
      return {
        results: domainGroup,
        resultsMap: domainGroupMap
      };
    }
    return { results: domainGroup, resultsMap: domainGroupMap };
  }

  async convertToReferenceMap<T>(
    key: string,
    data: T[]
  ): Promise<Map<string | number, T>> {
    const domainTypeMap = new Map<string | number, T>();
    if (data && data.length) {
      for (let i = 0; i < data.length; i++) {
        if (data[i]) {
          const entry: T = data[i];
          if (entry[key]) {
            domainTypeMap.set(entry[key], entry);
            /*} else {
            domainTypeMap.set(entry['id'], entry);*/
          }
        }
      }
    }
    return domainTypeMap;
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
      throw new NotFoundException('Domains not found');
    }
  }
}
