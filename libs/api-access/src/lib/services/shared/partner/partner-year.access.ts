import { Injectable } from '@nestjs/common';
import {
  BaseDocument,
  BaseDocumentField,
  PartnerField,
  PartnerYearDocumentField,
} from '@ocw/shared-models';
import {
  PartnerYearDocument,
  PartnerYearSearchRequest,
} from '@ocw/shared-models';
import {
  AccessContext,
  LogService,
  GenericAccessUtil,
  IModelFields,
  AccessQueryFactory,
  QueryClause,
  ComparisonType,
  OrderClause,
  SortDirection,
} from '@ocw/api-core';
import {
  PartnerYearColumns,
  PartnerYearTableConfig,
} from '../../../tables/partner-year';
import { DateUtil } from '@ocw/shared-core';

@Injectable()
export class PartnerYearAccess {
  constructor(
    private readonly logService: LogService,
    private readonly accessQueryFactory: AccessQueryFactory
  ) {}

  async add(
    doc: PartnerYearDocument,
    accessContext: AccessContext
  ): Promise<PartnerYearDocument> {
    return (await GenericAccessUtil.add(
      accessContext,
      doc as BaseDocument,
      PartnerYearTableConfig,
      {
        [PartnerYearColumns.partner_id]: doc.partnerId,
        [PartnerYearColumns.start_dt]: doc.startDate,
      }
    )) as PartnerYearDocument;
  }

  async delete(
    doc: PartnerYearDocument,
    accessContext: AccessContext
  ): Promise<PartnerYearDocument> {
    return await GenericAccessUtil.delete(
      accessContext,
      doc,
      PartnerYearTableConfig
    );
  }

  async update(
    doc: PartnerYearDocument,
    accessContext: AccessContext
  ): Promise<PartnerYearDocument> {
    return (await GenericAccessUtil.update(
      accessContext,
      doc as BaseDocument,
      PartnerYearTableConfig,
      {
        [PartnerYearColumns.partner_id]: doc.partnerId,
        [PartnerYearColumns.start_dt]: doc.startDate,
      }
    )) as PartnerYearDocument;
  }

  async get(
    id: string,
    accessContext: AccessContext
  ): Promise<PartnerYearDocument> {
    return (await GenericAccessUtil.get(
      accessContext,
      id,
      PartnerYearTableConfig
    )) as PartnerYearDocument;
  }

  async search<T extends BaseDocument>(
    searchRequest: PartnerYearSearchRequest,
    accessContext: AccessContext
  ): Promise<T[]> {
    const accessQuery = this.accessQueryFactory.createQueryNew(
      PartnerYearTableConfig,
      accessContext
    );
    accessQuery.addColumn({ columnName: PartnerYearColumns.start_dt });
    if (searchRequest.partnerId) {
      accessQuery.WhereClauses.push(
        new QueryClause(
          PartnerYearTableConfig.tableName,
          IModelFields.json_document,
          [searchRequest.partnerId],
          ComparisonType.Equals,
          [PartnerYearDocumentField.partnerId]
        )
      );
    }

    if (searchRequest.id) {
      accessQuery.WhereClauses.push(
        new QueryClause(
          PartnerYearTableConfig.tableName,
          PartnerYearTableConfig.keyFieldName,
          [searchRequest.id],
          ComparisonType.Equals
        )
      );
    }

    if (searchRequest.idNotEqual) {
      accessQuery.WhereClauses.push(
        new QueryClause(
          PartnerYearTableConfig.tableName,
          PartnerYearTableConfig.keyFieldName,
          [searchRequest.idNotEqual],
          ComparisonType.NotEquals
        )
      );
    }

    if (searchRequest.fiscalYear) {
      accessQuery.WhereClauses.push(
        new QueryClause(
          PartnerYearTableConfig.tableName,
          IModelFields.json_document,
          [searchRequest.fiscalYear],
          ComparisonType.Equals,
          [PartnerYearDocumentField.fiscalYear]
        )
      );
    }

    if (searchRequest.startDt) {
      accessQuery.WhereClauses.push(
        new QueryClause(
          PartnerYearTableConfig.tableName,
          PartnerYearColumns.start_dt,
          [searchRequest.startDt],
          ComparisonType.Equals
        )
      );
    }

    if (searchRequest.startDtBefore) {
      accessQuery.WhereClauses.push(
        new QueryClause(
          PartnerYearTableConfig.tableName,
          PartnerYearColumns.start_dt,
          [searchRequest.startDtBefore],
          ComparisonType.LessThan
        )
      );
    }

    if (searchRequest.startDtBefore) {
      accessQuery.OrderClauses.push(
        new OrderClause(
          PartnerYearTableConfig.tableName,
          PartnerYearColumns.start_dt,
          SortDirection.desc
        )
      );
    }

    let items = await accessQuery.select();
    items = items.map((p) => {
      const doc = GenericAccessUtil.convertToDocument<PartnerYearDocument>(
        p,
        PartnerYearTableConfig,
        accessContext
      );
      doc.id = p[PartnerYearTableConfig.keyFieldName];
      doc.startDate = p[PartnerYearColumns.start_dt];
      doc[PartnerYearDocumentField.val] = DateUtil.formatDateFromTs(
        doc.startDate
      );
      return doc;
    });

    return items;
  }
}
