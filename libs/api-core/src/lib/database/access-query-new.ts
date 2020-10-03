import { QueryBuilder } from 'knex';
import { ITableConfig, IModelFields } from './db-models';
import { LogService } from '../logging/log.service';
import { RequestContext } from '../middleware/models';
import { AccessContext } from './access-context';
import {
  QueryJoin,
  JoinType,
  QueryColumn,
  QueryClause,
  OrderClause,
  ComparisonType,
} from './access-query-base';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export class AccessQueryNew {
  private columns = [];
  public query: QueryBuilder;
  private baseTable: string;
  public Columns: QueryColumn[] = [];
  public Joins: QueryJoin[] = [];
  public WhereClauses: QueryClause[] = [];
  public OrderClauses: OrderClause[] = [];

  constructor(
    private readonly accessContext: AccessContext,
    readonly tableConfig: ITableConfig,
    private readonly logService: LogService,
    private distinct?: boolean
  ) {
    this.baseTable = tableConfig.tableName;
    this.query = this.accessContext.knex(tableConfig.tableName);
    const currentUser = RequestContext.currentUser();
    this.query = this.query.where(
      `${this.baseTable}.${IModelFields.tenant_id}`,
      currentUser.tenantId
    );
    this.query = this.query.where(`${this.baseTable}.is_deleted`, false);

    if (!distinct) {
      this.Columns.push(
        new QueryColumn(tableConfig.tableName, tableConfig.keyFieldName)
      );
    } else {
      this.Columns.push(
        new QueryColumn(tableConfig.tableName, tableConfig.keyFieldName, {
          distinct: true,
        })
      );
    }
    this.Columns.push(
      new QueryColumn(tableConfig.tableName, IModelFields.is_deleted)
    );
    this.Columns.push(
      new QueryColumn(tableConfig.tableName, IModelFields.row_version)
    );
    this.Columns.push(
      new QueryColumn(tableConfig.tableName, IModelFields.tenant_id)
    );
    this.Columns.push(
      new QueryColumn(tableConfig.tableName, IModelFields.json_document)
    );
  }

  private translateJsonPath(path: string[]) {
    let sql = `'$`;
    const last = path.length - 1;
    for (let i = 0; i <= last; i++) {
      if (i === last) {
        sql += '.';
      } else {
        sql += '.';
      }
      sql += `${path[i]}'`;
    }
    return sql;
  }

  public addWhereClause(options: {
    tableName?: string;
    columnName?: string;
    values: any[];
    comparison: ComparisonType;
    jsonPath?: string[];
  }) {
    if (!options.tableName) {
      options.tableName = this.baseTable;
    }
    if (options.jsonPath && !options.columnName) {
      options.columnName = IModelFields.json_document;
    }
    if (!options.jsonPath && !options.columnName) {
      throw new BadRequestException('Column Name required with no JsonPath');
    }
    this.WhereClauses.push(
      new QueryClause(
        options.tableName,
        options.columnName,
        options.values,
        options.comparison,
        options.jsonPath
      )
    );
  }

  public addJoin(options: {
    tableName?: string;
    targetTableName: string;
    targetTableAlias?: string;
    joinType?: JoinType;
    sourceColumnName: string;
    targetColumnName?: string;
    hideDeleted?: boolean;
  }) {
    if (!options.tableName) {
      options.tableName = this.baseTable;
    }
    if (!options.joinType) {
      options.joinType = JoinType.Inner;
    }
    if (!options.targetTableAlias) {
      options.targetTableAlias = options.targetTableName;
    }
    if (!options.targetColumnName) {
      options.targetColumnName = options.sourceColumnName;
    }

    this.Joins.push(
      new QueryJoin(
        options.tableName,
        options.targetTableName,
        options.targetTableAlias,
        options.sourceColumnName,
        options.targetColumnName,
        options.joinType,
        options.hideDeleted
      )
    );
  }

  public addColumn(options: {
    tableName?: string;
    columnName: string;
    renameAs?: string;
    jsonPath?: string;
  }) {
    if (!options.tableName) {
      options.tableName = this.baseTable;
    }

    this.Columns.push(
      new QueryColumn(options.tableName, options.columnName, {
        renameAs: options.renameAs,
        jsonPath: options.jsonPath,
      })
    );
  }

  private buildJsonWhere(p: QueryClause) {
    return `JSON_VALUE(${p.tableName}.${p.columnName},${this.translateJsonPath(
      p.jsonPaths
    )})`;
  }

  buildWhere() {
    this.WhereClauses.forEach((p) => {
      if (p.jsonPaths) {
        if (p.comparison === ComparisonType.Equals) {
          this.query = this.query.whereRaw(
            `${this.buildJsonWhere(p)} = ?`,
            p.values[0]
          );
        }
        if (p.comparison === ComparisonType.GreaterThanOrEquals) {
          this.query = this.query.whereRaw(
            `${this.buildJsonWhere(p)} >= ?`,
            p.values[0]
          );
        }
        if (p.comparison === ComparisonType.LessThan) {
          this.query = this.query.whereRaw(
            `${this.buildJsonWhere(p)} < ?`,
            p.values[0]
          );
        }
        if (p.comparison === ComparisonType.In) {
          let parms = '';
          for (let i = 0; i < p.values.length; i++) {
            if (parms.length > 0) {
              parms += ',';
            }
            parms += '?';
          }
          this.query = this.query.whereRaw(
            `${this.buildJsonWhere(p)} in (${parms})`,
            p.values
          );
        }
        if (p.comparison === ComparisonType.Like) {
          this.query = this.query.whereRaw(
            `${this.buildJsonWhere(p)} like ?`,
            p.values[0]
          );
        }
        if (p.comparison === ComparisonType.Between) {
          if (p.values.length !== 2) {
            throw new BadRequestException('Must have 2 values for Between');
          }
          this.query = this.query.whereRaw(
            `${this.buildJsonWhere(p)} >= ? `,
            p.values[0]
          );
          this.query = this.query.whereRaw(
            `${this.buildJsonWhere(p)} < ? `,
            p.values[1]
          );
        }
        if (p.comparison === ComparisonType.OrEquals) {
          if (p.values.length !== p.jsonPaths.length) {
            throw new BadRequestException(
              'Must have equal values and paths count for OrEquals'
            );
          }
          this.query = this.query.orWhere(function () {
            this.whereRaw(
              `JSON_VALUE(${p.tableName}.${p.columnName},'$.${p.jsonPaths[0]}') = ? `,
              p.values[0]
            );
            for (let i = 1; i < p.values.length; i++) {
              this.whereRaw(
                `JSON_VALUE(${p.tableName}.${p.columnName},'$.${p.jsonPaths[i]}') = ? `,
                p.values[i]
              );
            }
          });
        }
      } else {
        if (p.comparison === ComparisonType.Bitwise) {
          console.log('value', p.values[0]);
          this.query = this.query.whereRaw(
            `(${p.values[0]} & ${p.tableName}.${p.columnName}) = ?`,
            p.values[0]
          );
        }
        if (p.comparison === ComparisonType.IsNull) {
          this.query = this.query.whereNull(`${p.tableName}.${p.columnName}`);
        }
        if (p.comparison === ComparisonType.Equals) {
          this.query = this.query.where(
            `${p.tableName}.${p.columnName}`,
            p.values[0]
          );
        }
        if (p.comparison === ComparisonType.GreaterThanOrEquals) {
          this.query = this.query.whereRaw(
            `${p.tableName}.${p.columnName} >= ?`,
            p.values[0]
          );
        }
        if (p.comparison === ComparisonType.LessThan) {
          this.query = this.query.whereRaw(
            `${p.tableName}.${p.columnName} < ?`,
            p.values[0]
          );
        }
        if (p.comparison === ComparisonType.In) {
          this.query = this.query.whereIn(
            `${p.tableName}.${p.columnName}`,
            p.values
          );
        }
        if (p.comparison === ComparisonType.Between) {
          if (p.values.length !== 2) {
            throw new BadRequestException('Must have 2 values for Between');
          }
          this.query = this.query.whereBetween(
            `${p.tableName}.${p.columnName}`,
            [p.values[0], p.values[1]]
          );
        }
        if (p.comparison === ComparisonType.NotEquals) {
          this.query = this.query.whereNot(
            `${p.tableName}.${p.columnName}`,
            p.values[0]
          );
        }
        if (p.comparison === ComparisonType.Like) {
          this.query = this.query.whereRaw(
            `${p.tableName}.${p.columnName} like ? `,
            p.values[0]
          );
        }
        if (p.comparison === ComparisonType.InOrNull) {
          this.query = this.query.andWhere(function () {
            this.whereIn(`${p.columnName}`, p.values);
            this.orWhereNull(`${p.columnName}`);
          });
        }
      }
    });
  }

  buildOrderBy() {
    this.OrderClauses.forEach((p) => {
      if (!p.jsonPath) {
        this.query = this.query.orderByRaw(
          `${p.tableName}.${p.columnName} ${p.direction} `
        );
      } else {
        this.query = this.query.orderByRaw(
          `JSON_VALUE(${p.tableName}.${p.columnName},'$.${p.jsonPath}') ${p.direction} `
        );
      }
    });
  }

  buildJoins() {
    this.Joins.forEach((p) => {
      if (p.type === JoinType.Left) {
        this.query.leftJoin(
          `${p.targetTableName} as ${p.targetTableAlias}`,
          function () {
            this.on(
              `${p.sourceTableName}.${p.sourceColumn}`,
              '=',
              `${p.targetTableAlias}.${p.targetColumn}`
            );
            this.on(
              `${p.sourceTableName}.tenant_id`,
              '=',
              `${p.targetTableAlias}.tenant_id`
            );
          }
        );
      }
      if (p.type === JoinType.Inner) {
        this.query.join(
          `${p.targetTableName} as ${p.targetTableAlias}`,
          function () {
            this.on(
              `${p.sourceTableName}.${p.sourceColumn}`,
              '=',
              `${p.targetTableAlias}.${p.targetColumn}`
            );
            this.on(
              `${p.sourceTableName}.tenant_id`,
              '=',
              `${p.targetTableAlias}.tenant_id`
            );
          }
        );
      }
    });
    return this.query;
  }

  buildColumns() {
    this.Columns.forEach((p) => {
      if (p.options && p.options.jsonPath) {
        let sql = `JSON_QUERY(${p.tableName}.${IModelFields.json_document},'$.${p.options.jsonPath}')`;
        if (p.options.renameAs) {
          sql += ` as ${p.options.renameAs}`;
        }
        this.columns.push(this.accessContext.knex.raw(sql));
      } else {
        let sql = ``;
        if (p.options?.distinct) {
          sql += ` distinct(${p.tableName}.${p.columnName})`;
        } else {
          sql += `${p.tableName}.${p.columnName}`;
        }
        if (p.options && p.options.renameAs) {
          sql += ` as ${p.options.renameAs}`;
        }
        this.columns.push(this.accessContext.knex.raw(sql));
      }
    });
  }

  async select() {
    this.buildColumns();
    this.query = this.query.select(this.columns);
    this.buildJoins();
    this.buildWhere();
    this.buildOrderBy();

    let exception: Error;
    let results = [];
    try {
      results = await this.query;
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

  /*async awaitQuery() {
    const result = await this.query
      .then((res) => res)
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return result;
  }*/
}
