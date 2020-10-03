import { Injectable } from '@nestjs/common';
import { BaseDocument, BaseDomainKeyEnum } from '@ocw/shared-models';
import {
  PartnerDocument,
  PartnerField,
  PartnerSearchRequest
} from '@ocw/shared-models';
import {
  AccessContext,
  LogService,
  GenericAccessUtil,
  AccessQuery,
  IModelFields,
  AccessQueryFactory,
  ComparisonType,
  QueryClause
} from '@ocw/api-core';
import { PartnerTableConfig, PartnerTable } from '../../../tables/partner';

@Injectable()
export class PartnerAccess {
  constructor(
    private readonly logService: LogService,
    private readonly accessQueryFactory: AccessQueryFactory
  ) {}

  async add(
    doc: PartnerDocument,
    accessContext: AccessContext
  ): Promise<PartnerDocument> {
    return (await GenericAccessUtil.add(
      accessContext,
      doc as BaseDocument,
      PartnerTableConfig,
      {}
    )) as PartnerDocument;
  }

  async delete(
    doc: PartnerDocument,
    accessContext: AccessContext
  ): Promise<PartnerDocument> {
    return await GenericAccessUtil.delete(
      accessContext,
      doc,
      PartnerTableConfig
    );
  }

  async update(
    doc: PartnerDocument,
    accessContext: AccessContext
  ): Promise<PartnerDocument> {
    return (await GenericAccessUtil.update(
      accessContext,
      doc as BaseDocument,
      PartnerTableConfig,
      {}
    )) as PartnerDocument;
  }

  async get(
    id: string,
    accessContext: AccessContext
  ): Promise<PartnerDocument> {
    return (await GenericAccessUtil.get(
      accessContext,
      id,
      PartnerTableConfig
    )) as PartnerDocument;
  }

  async search(
    searchRequest: PartnerSearchRequest,
    accessContext: AccessContext
  ): Promise<PartnerDocument[]> {
    const accessQuery = this.accessQueryFactory.createQueryNew(
      PartnerTableConfig,
      accessContext
    );

    if (!searchRequest) {
      searchRequest = new PartnerSearchRequest();
    }

    if (searchRequest.partnerType) {
      accessQuery.WhereClauses.push(
        new QueryClause(
          PartnerTableConfig.tableName,
          IModelFields.json_document,
          [0],
          ComparisonType.Equals,
          [PartnerField.partnerType]
        )
      );
    }

    let items = await accessQuery.select();
    items = items.map((p: PartnerTable) => {
      const doc = GenericAccessUtil.convertToDocument<PartnerDocument>(
        p,
        PartnerTableConfig,
        accessContext
      );
      doc.referenceGroup = BaseDomainKeyEnum.Partner;
      doc.referenceType = BaseDomainKeyEnum.Partner;
      return doc;
    });
    return items;
  }
}
