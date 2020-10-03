import { QueryBuilder } from 'knex';
import { ITableConfig, IModelFields } from './db-models';
import { LogService } from '../logging/log.service';
import { RequestContext } from '../middleware/models';
import { AccessContext } from './access-context';
import {
  SortDirection,
  JsonFieldCompare,
  IAccessQuery,
  QueryJoin
} from './access-query-base';

export class QueryColumns {
  constructor(
    private baseTable: string,
    private columns: any[],
    private accessContext: AccessContext
  ) {}

  addJsonDocumentColumn() {
    this.addColumn(IModelFields.json_document);
  }

  addJsonEntityColumn(entityName: string) {
    this.columns.push(
      this.accessContext.knex.raw(
        `${this.baseTable}.${
          IModelFields.json_document
        } ->'${entityName}' as ${entityName}`
      )
    );
  }

  addJsonColumnForJoinTable(tableName: string, rename: string) {
    this.columns.push(
      this.accessContext.knex.raw(
        `${tableName}.${IModelFields.json_document} as ${rename}`
      )
    );
  }

  addJsonEntityColumnForJoinTable(tableName: string, entityName: string) {
    this.columns.push(
      this.accessContext.knex.raw(
        `${tableName}.${
          IModelFields.json_document
        } ->'${entityName}' as ${entityName}`
      )
    );
  }

  addColumnForJoinTable(tableName: string, columnName: string) {
    this.columns.push(
      this.accessContext.knex.raw(`${tableName}.${columnName}`)
    );
  }

  addColumn(columnName: string) {
    this.columns.push(`${this.baseTable}.${columnName}`);
  }

  addColumnWithName(columnName: string, nameAs: string) {
    this.columns.push(
      this.accessContext.knex.raw(
        `${this.baseTable}.${columnName} as ${nameAs}`
      )
    );
  }
}

export class AccessQuery implements IAccessQuery {
  private joins: { [tableName: string]: {} } = {};
  private leftJoins: { [tableName: string]: {} } = {};
  private columns = [];
  private query: QueryBuilder;
  private baseTable: string;
  public Columns: QueryColumns;
  public Joins: QueryJoin[];

  constructor(
    private readonly accessContext: AccessContext,
    readonly tableConfig: ITableConfig,
    private readonly logService: LogService
  ) {
    this.baseTable = tableConfig.tableName;
    this.query = this.accessContext.knex(tableConfig.tableName);
    const currentUser = RequestContext.currentUser();
    this.query = this.query.where(
      `${this.baseTable}.${IModelFields.tenant_id}`,
      currentUser.tenantId
    );
    this.query = this.query.where(`${this.baseTable}.is_deleted`, false);
    this.Columns = new QueryColumns(
      this.baseTable,
      this.columns,
      this.accessContext
    );
    this.Columns.addColumn(IModelFields.is_deleted);
    this.Columns.addColumn(IModelFields.row_version);
    this.Columns.addColumn(IModelFields.tenant_id);
    this.Columns.addColumn(IModelFields.json_document);
    this.Columns.addColumn(tableConfig.keyFieldName);
  }

  private translateJsonPath(path: string[]) {
    let sql = '';
    const last = path.length - 1;
    for (let i = 0; i <= last; i++) {
      if (i === last) {
        sql += ' ->> ';
      } else {
        sql += '->';
      }
      sql += `'${path[i]}'`;
    }
    return sql;
  }

  addJoin(targetTable: string, joinColumn: string, hideDeleted?: boolean) {
    const joinObject = {};
    joinObject[
      `${this.baseTable}.${joinColumn}`
    ] = `${targetTable}.${joinColumn}`;
    joinObject[
      `${this.baseTable}.${IModelFields.tenant_id}`
    ] = `${targetTable}.${IModelFields.tenant_id}`;
    this.joins[targetTable] = joinObject;

    if (hideDeleted) {
      this.query = this.query.where(
        `${targetTable}.${IModelFields.is_deleted}`,
        false
      );
    }
  }

  addLeftJoin(targetTable: string, joinColumn: string, hideDeleted?: boolean) {
    const joinObject = {};
    joinObject[
      `${this.baseTable}.${joinColumn}`
    ] = `${targetTable}.${joinColumn}`;
    joinObject[
      `${this.baseTable}.${IModelFields.tenant_id}`
    ] = `${targetTable}.${IModelFields.tenant_id}`;
    this.leftJoins[targetTable] = joinObject;

    if (hideDeleted) {
      this.query = this.query.where(
        `${targetTable}.${IModelFields.is_deleted}`,
        false
      );
    }
  }

  addWhere(columnName: string, value: string | number | boolean) {
    this.query = this.query.where(`${this.baseTable}.${columnName}`, value);
  }

  addWhereNot(columnName: string, value: string | number) {
    this.query = this.query.whereNot(`${this.baseTable}.${columnName}`, value);
  }

  addWhereJoinValue(
    tableName: string,
    columnName: string,
    value: string | number | boolean
  ) {
    this.query = this.query.where(`${tableName}.${columnName}`, value);
  }

  addWhereBetween(columnName: string, value1: number, value2: number) {
    this.query = this.query.whereBetween(`${this.baseTable}.${columnName}`, [
      value1,
      value2
    ]);
  }

  addWhereIn(columnName: string, values: number[] | string[]) {
    this.query = this.query.whereIn(`${this.baseTable}.${columnName}`, values);
  }

  addWhereJsonAttribute(columnName: string, value: string | number | boolean) {
    this.query = this.query.whereRaw(
      `${this.baseTable}.${IModelFields.json_document} ->> '${columnName}' = ?`,
      value
    );
  }

  addWhereJson(entityName: string, columnName: string, value: string | number) {
    this.query = this.query.whereRaw(
      `${this.baseTable}.${
        IModelFields.json_document
      } -> '${entityName}' ->> '${columnName}' = ?`,
      value
    );
  }

  addWhereJsonPath(
    path: string[],
    value: string | number | boolean,
    comparison?: string
  ) {
    if (!comparison) {
      comparison = ' = ';
    }
    this.query = this.query.whereRaw(
      `${this.baseTable}.${IModelFields.json_document}` +
        this.translateJsonPath(path) +
        ` ${comparison} ? `,
      value
    );
  }

  addWhereJsonPathLike(path: string[], value: string | number | boolean) {
    this.query = this.query.whereRaw(
      `lower(${this.baseTable}.${IModelFields.json_document}` +
        this.translateJsonPath(path) +
        ') like lower(?) ',
      value
    );
  }

  addWhereJsonLike(entityName: string, columnName: string, value: string) {
    this.query = this.query.whereRaw(
      `lower(${this.baseTable}.${
        IModelFields.json_document
      } -> '${entityName}' ->> '${columnName}') like lower(?)`,
      value
    );
  }

  addWhereJsonOrList(fieldList: JsonFieldCompare[]) {
    const baseTable = this.baseTable;
    if (fieldList.length > 0) {
      const jsonPath = this.translateJsonPath(fieldList[0].path);
      this.query = this.query.andWhere(function() {
        this.whereRaw(
          `${baseTable}.${IModelFields.json_document}` + jsonPath + ' like ? ',
          fieldList[0].value
        );
        for (let i = 1; i < fieldList.length; i++) {
          this.whereRaw(
            `${baseTable}.${IModelFields.json_document}` +
              jsonPath +
              ' like ? ',
            fieldList[0].value
          );
        }
      });
    }
  }

  addWhereJsonIn(
    values: string[] | number[],
    tableName: string,
    ...jsonPath: string[]
  ) {
    if (!values) {
      return;
    }
    let parms = '';
    for (let i = 0; i < values.length; i++) {
      if (parms.length > 0) {
        parms += ',';
      }
      parms += '?';
    }
    let raw = '';
    const path = jsonPath.reverse();
    raw += `${tableName}.json_document`;
    while (path.length > 1) {
      raw += ` -> '${path.pop()}' `;
    }
    raw += ` ->> '${path.pop()}'  in (${parms})`;
    this.query = this.query.whereRaw(raw, values);
  }

  addWhereJsonAttributeLike(columnName: string, value: string) {
    this.query = this.query.whereRaw(
      `lower(${this.baseTable}.${
        IModelFields.json_document
      } ->> '${columnName}') like lower(?)`,
      value
    );
  }

  addOrderBy(columnName: string, direction: SortDirection) {
    this.query = this.query.orderBy(columnName, direction);
  }

  addOrderByJsonAttribute(attributeName: string, direction: SortDirection) {
    this.query = this.query.orderByRaw(
      `"${this.baseTable}".${
        IModelFields.json_document
      } ->> '${attributeName}' ${direction} `
    );
  }
  addOrderByJsonEntityAttribute(
    entityName: string,
    attributeName: string,
    direction: SortDirection
  ) {
    this.query = this.query.orderByRaw(
      `"${this.baseTable}".${
        IModelFields.json_document
      }  -> '${entityName}' ->> '${attributeName}' ${direction} `
    );
  }

  addOrderByJsonEntityColumnForJoinTable(
    tableName: string,
    entityName: string,
    attributeName: string,
    direction: SortDirection
  ) {
    this.query = this.query.orderByRaw(
      `"${tableName}".${
        IModelFields.json_document
      }  -> '${entityName}' ->> '${attributeName}' ${direction} `
    );
  }

  async select(): Promise<any> {
    this.query = this.query.select(this.columns);
    for (const field of Object.keys(this.joins)) {
      const join = this.joins[field];
      this.query.join(field, join);
    }
    for (const field of Object.keys(this.leftJoins)) {
      const join = this.leftJoins[field];
      this.query.leftJoin(field, join);
    }
    return await this.query;
  }
}
