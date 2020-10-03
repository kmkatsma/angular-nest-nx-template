import { DateUtil } from '@ocw/shared-core';
import { InternalServerErrorException } from '@nestjs/common';
import { AccessContext } from '../access-context';
import { ITableConfig, IModelFields, BaseTable, IModel } from '../db-models';
import {
  AuditEventType,
  AuditEventTableConfig,
  AuditEventTableColumns,
  AuditEventTable,
} from './audit-event.config';
import { CurrentUser, RequestContext } from '../../middleware/models';
import { LogService } from '../../logging/log.service';

export class AuditEventUtil {
  static async audit<T>(
    accessContext: AccessContext,
    rowId: number,
    tableConfig: ITableConfig,
    eventType: AuditEventType,
    doc: T,
    overrideUser?: CurrentUser
  ): Promise<AuditEventTable> {
    const currentUser = overrideUser
      ? overrideUser
      : RequestContext.currentUser();
    const ts = DateUtil.getGMTTimestamp();

    console.log('audit event util', rowId, tableConfig);

    const record = this.createTableRecord<T>(
      doc,
      accessContext,
      rowId,
      currentUser,
      tableConfig.tableName,
      eventType
    );

    const result = await accessContext
      .knex(AuditEventTableConfig.tableName)
      .insert(record)
      .returning('*');
    if (result.length === 0) {
      throw new InternalServerErrorException(`Unable to write audit`);
    }
    return record;
  }

  static async auditAll<T>(
    accessContext: AccessContext,
    config: ITableConfig,
    rows: IModel[],
    overrideUser?: CurrentUser
  ): Promise<number> {
    const currentUser = overrideUser
      ? overrideUser
      : RequestContext.currentUser();
    const tableRecords = [];
    console.log('rows', rows);
    LogService.prettyPrint(rows);
    for (let i = 0; i < rows.length; i++) {
      const tableRecord = this.createTableRecord<T>(
        rows[i].json_document,
        accessContext,
        rows[i][config.keyFieldName],
        currentUser,
        config.tableName,
        AuditEventType.insert
      );
      tableRecords.push(tableRecord);
    }

    const result = await accessContext
      .knex(AuditEventTableConfig.tableName)
      .insert(tableRecords)
      .returning('*');
    if (result.length === 0) {
      throw new InternalServerErrorException(
        `Unable to addAll ${config.description}`
      );
    }
    return tableRecords.length;
  }

  public static createTableRecord<T>(
    doc: T,
    accessContext: AccessContext,
    rowId: number,
    currentUser: CurrentUser,
    tableName: string,
    eventType: AuditEventType
  ) {
    const ts = DateUtil.getGMTTimestamp();
    const record: AuditEventTable = {
      [IModelFields.json_document]: this.formatJsonDocument(doc, accessContext),
      [IModelFields.tenant_id]: currentUser.tenantId,
      [IModelFields.row_version]: ts,
      [IModelFields.is_deleted]: false,
      [AuditEventTableColumns.table_row_id]: rowId,
      [AuditEventTableColumns.event_date]: ts,
      [AuditEventTableColumns.table_name]: tableName,
      [AuditEventTableColumns.event_type]: eventType,
      [AuditEventTableColumns.user_id]: currentUser.userName,
    };
    return record;
  }

  private static formatJsonDocument(object: any, accessContext: AccessContext) {
    if (accessContext.isPostgres) {
      return object;
    } else {
      return JSON.stringify(object);
    }
  }
}
