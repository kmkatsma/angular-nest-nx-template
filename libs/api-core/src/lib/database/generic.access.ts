import { DateUtil } from '@ocw/shared-core';
import { IModel, ITableConfig, IModelFields, BaseTable } from './db-models';
import { RequestContext, CurrentUser } from '../middleware/models';
import { AuditUtil } from './audit/audit.util';
import { AccessContext } from './access-context';
import { AuditEventType } from './audit/audit-event.config';
import { AuditEventUtil } from './audit/audit-event-util';
import { KnexUtil } from './db-client-knex';
import { BaseDocument, BaseDocumentField } from '@ocw/shared-models';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { LogService } from '../logging/log.service';

export enum TableAction {
  Insert = 1,
  Update = 2,
  Delete = 3,
}

export interface IField {
  fieldName: string;
  documentAttributeName: string;
}

export class GenericAccessUtil {
  constructor() {}

  static nullToZero(value: number) {
    if (value === undefined || value === null) {
      return 0;
    } else {
      return value;
    }
  }

  static async addAll<T extends BaseDocument, R extends BaseTable>(
    accessContext: AccessContext,
    docs: T[],
    config: ITableConfig,
    fieldValues: {}
  ): Promise<R[]> {
    if (!docs || docs.length === 0) {
      return [];
    }
    const currentUser = RequestContext.currentUser();
    const tableRecords = this.buildRecords(
      docs,
      config,
      accessContext,
      currentUser,
      fieldValues
    );

    const result: IModel[] = await KnexUtil.insert(
      accessContext,
      tableRecords,
      config
    );
    for (let i = 0; i < result.length; i++) {
      result[i].json_document = JSON.parse(result[i].json_document);
    }
    await AuditEventUtil.auditAll(accessContext, config, result);
    return result as R[];
  }

  static async addAllTable<T extends IModel, R extends BaseTable>(
    accessContext: AccessContext,
    tableRecords: T[],
    config: ITableConfig
  ): Promise<R[]> {
    const result = await KnexUtil.insert(accessContext, tableRecords, config);
    return result as R[];
  }

  static buildRecords<T extends BaseDocument>(
    docs: T[],
    config: ITableConfig,
    accessContext: AccessContext,
    currentUser: CurrentUser,
    fieldValues: {}
  ): IModel[] {
    const tableRecords = [];
    LogService.trace('[GenericAccess.buildRecords]', docs);
    for (let i = 0; i < docs.length; i++) {
      AuditUtil.setCreateAuditInfo(currentUser, docs[i]);
      const tableRecord = this.convertToTable(
        docs[i],
        config,
        accessContext,
        currentUser,
        TableAction.Insert,
        fieldValues
      );
      tableRecords.push(tableRecord);
    }
    return tableRecords;
  }

  static async add<T extends BaseDocument>(
    accessContext: AccessContext,
    doc: T,
    config: ITableConfig,
    fieldValues?: {},
    overrideUser?: CurrentUser,
    options?: { skipTenantId: boolean }
  ): Promise<T> {
    const currentUser = overrideUser
      ? overrideUser
      : RequestContext.currentUser();
    if (doc.id && !config.customId) {
      throw new BadRequestException(
        'Document already exists - Document:' + doc.id
      );
    }
    AuditUtil.setCreateAuditInfo(currentUser, doc);
    const table = this.convertToTable(
      doc,
      config,
      accessContext,
      currentUser,
      TableAction.Insert,
      fieldValues,
      options
    );
    const result = await KnexUtil.insert(accessContext, table, config);
    await AuditEventUtil.audit(
      accessContext,
      result[0][config.keyFieldName],
      config,
      AuditEventType.insert,
      doc
    );
    return this.convertToDocument<T>(result[0], config, accessContext);
  }

  static async delete<T extends BaseDocument>(
    accessContext: AccessContext,
    doc: T,
    config: ITableConfig
  ): Promise<T> {
    const currentUser = RequestContext.currentUser();
    AuditUtil.setDeleteAuditInfo(currentUser, doc);

    const result = await KnexUtil.delete(
      accessContext,
      doc,
      config,
      currentUser
    );

    await AuditEventUtil.audit(
      accessContext,
      result[0][config.keyFieldName],
      config,
      AuditEventType.logical_delete,
      doc
    );
    return this.convertToDocument<T>(result[0], config, accessContext);
  }

  static async physical_delete(
    accessContext: AccessContext,
    config: ITableConfig,
    fieldValues: {},
    overrideUser?: CurrentUser
  ): Promise<void> {
    const currentUser = overrideUser
      ? overrideUser
      : RequestContext.currentUser();
    await accessContext
      .knex(config.tableName)
      .delete()
      .where(
        Object.assign(
          {
            [IModelFields.tenant_id]: currentUser.tenantId,
          },
          fieldValues
        )
      );
    await AuditEventUtil.audit(
      accessContext,
      0,
      config,
      AuditEventType.physical_delete,
      fieldValues
    );
  }

  static async update<T extends BaseDocument>(
    accessContext: AccessContext,
    doc: T,
    config: ITableConfig,
    fieldValues: {},
    options?: { skipTenantId: boolean }
  ): Promise<T> {
    if (!doc.id) {
      throw new NotFoundException('Document does not exist');
    }
    const currentUser = RequestContext.currentUser();
    AuditUtil.setUpdateAuditInfo(currentUser, doc);
    const table = this.convertToTable<IModel>(
      doc,
      config,
      accessContext,
      currentUser,
      TableAction.Update,
      fieldValues
    );
    const result = await KnexUtil.update(
      accessContext,
      table,
      doc,
      config,
      currentUser,
      options
    );

    await AuditEventUtil.audit(
      accessContext,
      result[0][config.keyFieldName],
      config,
      AuditEventType.update,
      doc
    );
    return this.convertToDocument<T>(result[0], config, accessContext);
  }

  static async get<T extends BaseDocument>(
    accessContext: AccessContext,
    id: string,
    config: ITableConfig,
    tableColumns?: string[],
    columnMapping?: {}
  ): Promise<T> {
    const columns = [];
    if (tableColumns) {
      columns.push(...tableColumns);
    }
    /*if (config.columns) {
      columns.push(...Object.keys(config.columns);
    }*/

    const currentUser = RequestContext.currentUser();
    const result = await KnexUtil.select(
      accessContext,
      id,
      config,
      columns,
      currentUser
    );
    return this.convertToDocument<T>(
      result[0],
      config,
      accessContext,
      columnMapping
    );
  }

  static async getListForClause<T extends BaseDocument>(
    accessContext: AccessContext,
    config: ITableConfig,
    fieldValues: {},
    columnMapping?: {}
  ): Promise<T[]> {
    const currentUser = RequestContext.currentUser();
    const fieldArray = [];
    if (config.table) {
      fieldArray.push(...Object.keys(config.table));
    } else {
      fieldArray.push(
        IModelFields.row_version,
        config.keyFieldName,
        IModelFields.tenant_id,
        IModelFields.json_document
      );
    }
    /*if (config.columns) {
      fieldArray.push(...Object.keys(config.columns));
    }*/
    const items = await accessContext
      .knex(config.tableName)
      .select(fieldArray)
      .where(
        Object.assign(
          {
            [IModelFields.tenant_id]: currentUser.tenantId,
            is_deleted: false,
          },
          fieldValues
        )
      );
    return (items as IModel[]).map((p) => {
      return this.convertToDocument(p, config, accessContext, columnMapping);
    });
  }

  static async getTableRowsForClause<T extends IModel>(
    accessContext: AccessContext,
    config: ITableConfig,
    fieldValues: {}
  ): Promise<T[]> {
    const currentUser = RequestContext.currentUser();
    const fieldArray = [];
    if (config.table) {
      fieldArray.push(...Object.keys(config.table));
    } else {
      fieldArray.push(
        IModelFields.row_version,
        config.keyFieldName,
        IModelFields.tenant_id,
        IModelFields.json_document
      );
    }
    return await accessContext
      .knex(config.tableName)
      .select(fieldArray)
      .where(
        Object.assign(
          {
            [IModelFields.tenant_id]: currentUser.tenantId,
            is_deleted: false,
          },
          fieldValues
        )
      );
  }

  static convertToDocument<T>(
    input: IModel,
    config: ITableConfig,
    accessContext: AccessContext,
    columnMapping?: {}
  ): T {
    let document: T;
    if (accessContext.isPostgres) {
      document = input[IModelFields.json_document] as T;
    } else {
      document = JSON.parse(input[IModelFields.json_document]);
    }
    document[BaseDocumentField.rowVersion] = input[IModelFields.row_version];
    document[BaseDocumentField.id] = input[config.keyFieldName];
    if (!columnMapping) {
      columnMapping = config.columnsMap;
    }
    if (columnMapping) {
      Object.keys(columnMapping).forEach((p) => {
        document[columnMapping[p]] = input[p];
      });
    }
    return document;
  }

  static convertToObject<T>(
    tableRecord: IModel,
    keyFieldName: string,
    accessContext: AccessContext,
    columnOverride?: string,
    skipCopyFields?: boolean
  ) {
    let doc: any;
    if (accessContext.isPostgres) {
      doc = columnOverride
        ? tableRecord[columnOverride]
        : tableRecord.json_document;
    } else {
      doc = JSON.parse(
        columnOverride ? tableRecord[columnOverride] : tableRecord.json_document
      );
    }
    if (doc && !skipCopyFields) {
      GenericAccessUtil.copyTableFieldsToDoc(doc, tableRecord, keyFieldName);
    }
    return doc as T;
  }

  static convertToTable<T>(
    document: BaseDocument,
    config: ITableConfig,
    accessContext: AccessContext,
    currentUser: CurrentUser,
    actionType: TableAction,
    fieldValues: {},
    options?: { skipTenantId: boolean }
  ): T {
    const table = {};
    table[IModelFields.json_document] = this.formatJsonDocument(
      document,
      accessContext
    );
    if (actionType === TableAction.Insert) {
      if (!options || !options.skipTenantId) {
        table[IModelFields.tenant_id] = currentUser.tenantId;
      }
      table[IModelFields.row_version] = DateUtil.getGMTTimestamp();
      table[IModelFields.is_deleted] = false;
    }
    if (actionType === TableAction.Update) {
      table[IModelFields.row_version] = DateUtil.getGMTTimestamp();
    }
    const tableRecord = Object.assign(table, fieldValues);

    if (config.columnsMap && config.documentAttributes) {
      Object.keys(config.documentAttributes).forEach((p) => {
        if (config.columnsMap[p]) {
          tableRecord[config.columnsMap[p]] = document[p];
        }
      });
    }
    return tableRecord as T;
  }

  static formatJsonDocument(object: any, accessContext: AccessContext) {
    if (accessContext.isPostgres) {
      return object;
    } else {
      return JSON.stringify(object);
      //return object;
    }
  }

  static convertFromJSON(object: any, accessContext: AccessContext) {
    if (accessContext.isPostgres) {
      return object;
    } else {
      return JSON.parse(object);
    }
  }

  static copyTableFieldsToDoc(
    document: BaseDocument,
    tableRecord: IModel,
    keyFieldName: string
  ) {
    document[BaseDocumentField.rowVersion] =
      tableRecord[IModelFields.row_version];
    document[BaseDocumentField.id] = tableRecord[keyFieldName];
  }

  static async executeQuery(
    queryToRun,
    sql: string,
    parms: any[],
    mappingFunction,
    mappingArgs
  ) {
    let exception;
    let results;
    try {
      results = await queryToRun(sql, parms);
      return results.map((p: IModel) => {
        mappingFunction(mappingArgs, p);
      });
    } catch (e) {
      exception = e;
    } finally {
      if (exception) {
        throw new InternalServerErrorException(
          exception,
          'Unknown Exception Occurred'
        );
      }
    }
  }

  static async executeRaw(
    accessContext: AccessContext,
    sql: string,
    parms: any[]
  ) {
    let exception: Error;
    let results = [];
    try {
      results = await accessContext.knex.raw(sql, parms);
      return results;
    } catch (e) {
      exception = e;
    } finally {
      if (exception) {
        throw new InternalServerErrorException(
          exception,
          'Unknown Exception Occurred'
        );
      }
      return results;
    }
  }

  /* TODO: pagination?
    var reqData = req.query;
    var pagination = {};
    var per_page = reqData.per_page || 10;
    var page = reqData.current_page || 1;
    if (page < 1) page = 1;
    var offset = (page - 1) * per_page;
    return Promise.all([
        db.count('* as count').from("site.site_product").first(),
        db.select("*").from("site.site_product").offset(offset).limit(per_page)
    ]).then(([total, rows]) => {
        var count = total.count;
        var rows = rows;
        pagination.total = count;
        pagination.per_page = per_page;
        pagination.offset = offset;
        pagination.to = offset + rows.length;
        pagination.last_page = Math.ceil(count / per_page);
        pagination.current_page = page;
        pagination.from = offset;
        pagination.data = rows;
        res.render("inventory/site_product", {
            data: pagination
        });
    });*/
}
