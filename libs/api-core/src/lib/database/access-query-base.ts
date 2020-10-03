export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

export enum JoinType {
  Left = 1,
  Inner = 2,
  Outer,
}

export enum ComparisonType {
  Equals = 1,
  NotEquals = 2,
  Between = 3,
  In = 4,
  Like = 5,
  OrEquals = 6,
  GreaterThanOrEquals = 7,
  LessThan = 8,
  Bitwise = 9,
  InOrNull = 10,
  IsNull = 11,
}

export class QueryJoin {
  constructor(
    public sourceTableName: string,
    public targetTableName: string,
    public targetTableAlias: string,
    public sourceColumn: string,
    public targetColumn: string,
    public type: JoinType,
    public hideDeleted?: boolean
  ) {}
}

export class QueryColumn {
  constructor(
    public tableName: string,
    public columnName: string,
    public options?: {
      jsonPath?: string;
      renameAs?: string;
      distinct?: boolean;
    }
  ) {}
}

export class QueryClause {
  constructor(
    public tableName: string,
    public columnName: string,
    public values: any[],
    public comparison: ComparisonType,
    public jsonPaths?: string[]
  ) {}

  columnValue(columnName: string) {
    this.columnName = columnName;
    return this;
  }
  jsonValue(path: string, columnName?: string) {
    this.jsonPaths = [path];
    return this;
  }
  equals(value: any) {
    this.values = [value];
    this.comparison = ComparisonType.Equals;
  }
  like(value: any) {
    this.values = [value];
    this.comparison = ComparisonType.Like;
  }
  between(value: any, value2: any) {
    this.values = [value, value2];
    this.comparison = ComparisonType.Between;
  }
  in(values: any[]) {
    this.values = values;
    this.comparison = ComparisonType.In;
  }
  notEqual(values: any) {
    this.values = [values];
    this.comparison = ComparisonType.NotEquals;
  }
}

export class OrderClause {
  constructor(
    public tableName: string,
    public columnName: string,
    public direction: SortDirection,
    public jsonPath?: string
  ) {}
}

export class JsonFieldCompare {
  constructor(public path: string[], public value: string) {}
}

export interface IQueryColumns {
  addJsonDocumentColumn(): void;
  addJsonEntityColumn(entityName: string): void;
  addJsonColumnForJoinTable(tableName: string, rename: string): void;
  addJsonEntityColumnForJoinTable(tableName: string, entityName: string): void;
  addColumnForJoinTable(tableName: string, columnName: string): void;
  addColumn(columnName: string): void;
  addColumnWithName(columnName: string, nameAs: string): void;
}

export interface IAccessQuery {
  Columns: IQueryColumns;
  Joins: QueryJoin[];

  addJoin(targetTable: string, joinColumn: string, hideDeleted?: boolean): void;
  addLeftJoin(
    targetTable: string,
    joinColumn: string,
    hideDeleted?: boolean
  ): void;
  addWhere(columnName: string, value: string | number | boolean): void;
  addWhereNot(columnName: string, value: string | number): void;
  addWhereJoinValue(
    tableName: string,
    columnName: string,
    value: string | number | boolean
  ): void;
  addWhereBetween(columnName: string, value1: number, value2: number): void;
  addWhereIn(columnName: string, values: number[] | string[]): void;
  addWhereJsonAttribute(
    columnName: string,
    value: string | number | boolean
  ): void;
  addWhereJson(
    entityName: string,
    columnName: string,
    value: string | number
  ): void;
  addWhereJsonPath(
    path: string[],
    value: string | number | boolean,
    comparison?: string
  ): void;
  addWhereJsonPathLike(path: string[], value: string | number | boolean): void;
  addWhereJsonLike(entityName: string, columnName: string, value: string): void;
  addWhereJsonOrList(fieldList: JsonFieldCompare[]): void;
  addWhereJsonIn(
    values: string[] | number[],
    tableName: string,
    ...jsonPath: string[]
  ): void;
  addWhereJsonAttributeLike(columnName: string, value: string): void;
  addOrderBy(columnName: string, direction: SortDirection): void;
  addOrderByJsonAttribute(
    attributeName: string,
    direction: SortDirection
  ): void;
  addOrderByJsonEntityAttribute(
    entityName: string,
    attributeName: string,
    direction: SortDirection
  ): void;
  addOrderByJsonEntityColumnForJoinTable(
    tableName: string,
    entityName: string,
    attributeName: string,
    direction: SortDirection
  ): void;
  select(): Promise<any>;
}
