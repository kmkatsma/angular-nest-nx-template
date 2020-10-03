import { ITableConfig, IModelFields, IModel, BaseTable } from './db-models';
import { AccessContext } from './access-context';
import {
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DateUtil } from '@ocw/shared-core';
import { CurrentUser } from '../middleware/models';
import { BaseDocument, BaseDocumentField } from '@ocw/shared-models';

export class KnexUtil {
  static async insert<T>(
    accessContext: AccessContext,
    savedTable: T | T[],
    config: ITableConfig
  ) {
    const result: BaseTable[] = await accessContext
      .knex(config.tableName)
      .insert(savedTable)
      .returning('*');
    if (result.length === 0) {
      throw new InternalServerErrorException(
        `Unable to add ${config.description}`
      );
    }
    return result;
  }

  static async delete<T extends BaseDocument>(
    accessContext: AccessContext,
    doc: T,
    config: ITableConfig,
    currentUser: CurrentUser
  ) {
    const result = await accessContext
      .knex(config.tableName)
      .update(
        Object.assign({
          is_deleted: true,
          [IModelFields.row_version]: DateUtil.getGMTTimestamp(),
        })
      )
      .where({
        [config.keyFieldName]: doc[BaseDocumentField.id],
        [IModelFields.tenant_id]: currentUser.tenantId,
        [IModelFields.row_version]: doc[BaseDocumentField.rowVersion],
      })
      .returning('*');
    if (result.length === 0) {
      throw new BadRequestException(
        `${config.description} has been updated by someone else.  Please refresh and try again`
      );
    }
    return result;
  }

  static async update<T extends BaseDocument>(
    accessContext: AccessContext,
    table: IModel,
    doc: T,
    config: ITableConfig,
    currentUser: CurrentUser,
    options?: { skipTenantId: boolean }
  ) {
    let whereClause = {};
    if (options && options.skipTenantId) {
      whereClause = {
        [config.keyFieldName]: doc.id,
        [IModelFields.row_version]: doc[BaseDocumentField.rowVersion],
      };
    } else {
      whereClause = {
        [config.keyFieldName]: doc.id,
        [IModelFields.tenant_id]: currentUser.tenantId,
        [IModelFields.row_version]: doc[BaseDocumentField.rowVersion],
      };
    }
    const result = await accessContext
      .knex(config.tableName)
      .update(table)
      .where(whereClause)
      .returning('*');
    if (result.length === 0) {
      throw new BadRequestException(
        `${config.description} has been updated by someone else.  Please refresh and try again`
      );
    }
    return result;
  }

  static async select<T extends BaseDocument>(
    accessContext: AccessContext,
    id: string,
    config: ITableConfig,
    columns: string[],
    currentUser: CurrentUser
  ) {
    const result = await accessContext
      .knex(config.tableName)
      .select([
        config.keyFieldName,
        IModelFields.row_version,
        IModelFields.tenant_id,
        IModelFields.json_document,
        ...columns,
      ])
      .where({
        [config.keyFieldName]: id,
        [IModelFields.tenant_id]: currentUser.tenantId,
      });
    if (result.length === 0) {
      throw new NotFoundException(`${config.description} not found`);
    }
    return result;
  }
}
