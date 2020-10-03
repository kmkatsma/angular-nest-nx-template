import * as Excel from 'exceljs';

export enum ReportFieldConstants {
  REPORT_DATE = 'REPORT_DATE',
  REPORT_DATE_RANGE = 'REPORT_DATE_RANGE'
}

export enum ReportConstants {
  UNIQUE_TOTALS = 'UNIQUE_TOTALS'
}

export enum ColumnTypeEnum {
  string = 1,
  int = 2,
  double = 3
}

export class ColumnOptions {
  headers?: string[];
  startRow?: number;
  key?: string;
  type?: ColumnTypeEnum;
  autofit?: boolean;

  constructor() {}
}

export class ReportColumn {
  startRow? = 1;
  headers?: string[];
  positionIncrement? = 1;
  key: string;
  type? = ColumnTypeEnum.int;
  autofit?: boolean;

  constructor(options?: ColumnOptions) {
    if (options) {
      if (options.headers) this.headers = options.headers;
      if (options.startRow) {
        this.startRow = options.startRow;
      }
      if (options.key) this.key = options.key;
      if (options.type) {
        this.type = options.type;
      } else {
        this.type = ColumnTypeEnum.int;
      }
      if (options.autofit) {
        this.autofit = options.autofit;
      } else {
        this.autofit = false;
      }
    }
  }
}

export class StringColumn extends ReportColumn {
  values = new Map<number | string, string | number>();

  constructor(options?: ColumnOptions) {
    super(options);
  }

  setValue(key: number | string, value: string | number) {
    this.values.set(key, value);
  }
}

export class NumericColumn extends ReportColumn {
  values = new Map<string | number, number>();
  total = 0;

  constructor(options?: ColumnOptions) {
    super(options);
  }

  addValue(key: number | string, value: number) {
    const current = this.values.get(key);
    if (current) {
      this.values.set(key, current + value);
    } else {
      this.values.set(key, value);
    }
  }
}

export class FontOptions {
  size: number;
  bold: boolean;
}

export class ReportCell {
  row: number;
  column: number;
  value?: string;
  placeHolder?: string;
  font?: FontOptions;
}

export class ReportCellValues {
  cells: ReportCell[];
}

export interface ReportPageDefinition {
  title: string;
  startColumn: number;
  startRow: number;
  columns: Array<ReportColumn>;
  cells?: ReportCell[];
  pageIndex: number;
}

export class ReportPage {
  private worksheet: Excel.Worksheet;
  columns = new Map<string, ReportColumn>();

  constructor(
    public definition: ReportPageDefinition,
    workbook: Excel.Workbook
  ) {
    this.worksheet = workbook.addWorksheet(definition.title);
    definition.columns.forEach(p => {
      if (p.type !== ColumnTypeEnum.string) {
        this.columns.set(
          p.key,
          new NumericColumn({ key: p.key, headers: p.headers, type: p.type })
        );
      } else if (p.type === ColumnTypeEnum.string) {
        this.columns.set(
          p.key,
          new StringColumn({ key: p.key, headers: p.headers, type: p.type })
        );
      } else {
        this.columns.set(
          p.key,
          new NumericColumn({ key: p.key, headers: p.headers, type: p.type })
        );
      }
    });
  }

  removeColumn(key: string) {
    this.columns.delete(key);
    for (let i = 0; i < this.definition.columns.length; i++) {
      const service = this.definition.columns[i];
      if (service.key === key) {
        this.definition.columns.splice(i, 1);
        break;
      }
    }
  }

  freezeRowPane(bottomRow: number) {
    this.worksheet.views = [{ state: 'frozen', ySplit: bottomRow }];
  }

  addColumnValue(columnKey: string, rowKey: string | number, value: number) {
    const column = this.columns.get(columnKey);
    if (!column) {
      return;
    }
    if (column.type !== ColumnTypeEnum.string) {
      const numberColumn = column as NumericColumn;
      numberColumn.addValue(rowKey, value);
      if (rowKey !== ReportConstants.UNIQUE_TOTALS) {
        numberColumn.total += value;
      }
    }
  }

  setColumnValue(
    columnKey: string,
    rowKey: string | number,
    value: string | number
  ) {
    const column = this.columns.get(columnKey);
    if (!column) {
      return;
    }
    if (column.type === ColumnTypeEnum.string) {
      const stringColumn = column as StringColumn;
      stringColumn.setValue(rowKey, value);
    }
  }

  getColumnTotal(columnKey: string): number | string {
    const column = this.columns.get(columnKey);
    if (!column) {
      return 0;
    }
    if (column.type === ColumnTypeEnum.int) {
      const numberColumn = column as NumericColumn;
      return numberColumn.total;
    }
    if (column.type === ColumnTypeEnum.double) {
      const numberColumn = column as NumericColumn;
      return Number(numberColumn.total.toFixed(2));
    }
    return 0;
  }

  getSpreadsheetColumns(): Partial<Excel.Column>[] {
    return this.worksheet.columns;
  }

  getNumericColumnValue(columnKey: string, rowKey: string | number): number {
    const totalColumn = this.columns.get(columnKey);
    const value = (totalColumn as NumericColumn).values.get(rowKey);
    if (!value || value === 0) {
      return 0;
    }
    return value;
  }

  getCell(row: number, column: number): Excel.Cell {
    return this.worksheet.getCell(row, column);
  }
}

export interface ReportDefinition {
  pages: ReportPageDefinition[];
}

export class Report {
  private workbook = new Excel.Workbook();
  private pages = new Map<string, ReportPage>();

  constructor(public definition: ReportDefinition) {
    this.definition.pages.forEach(p => {
      this.addPage(p);
    });
  }

  writeToReponse(res: any) {
    this.workbook.xlsx.write(res);
  }

  addPage(definition: ReportPageDefinition): ReportPage {
    const page = new ReportPage(definition, this.workbook);
    page.definition = definition;
    this.pages.set(definition.title, page);
    return page;
  }

  getPage(title: string): ReportPage {
    return this.pages.get(title);
  }
}
