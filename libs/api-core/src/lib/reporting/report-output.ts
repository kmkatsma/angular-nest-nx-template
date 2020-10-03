import { ValidationError } from '@ocw/shared-models';

export class OutputValue {
  name?: string;
  value: string | number;
  row?: number;
  column: number;

  constructor(row: number, column: number, value: string | number) {
    this.row = row;
    (this.column = column), (this.value = value);
  }
}

export class OutputRow {
  rowData: OutputValue[] = [];
  columns = 0;
  formatting: {
    topBorder?: boolean;
    bottomBorder?: boolean;
    fill?: boolean;
    bold?: boolean;
    fontSize?: number;
  };
  constructor(public row: number, private parent: ReportOutput) {}

  addCellValue(column: number, value: string | number) {
    const outputValue = new OutputValue(this.row, column, value);
    this.rowData.push(outputValue);
    this.parent.output.push(outputValue);
    if (this.columns < column) {
      this.columns = column;
    }
    return this;
  }

  addFormatting(options: {
    topBorder?: boolean;
    bottomBorder?: boolean;
    fill?: boolean;
    bold?: boolean;
    fontSize?: number;
  }) {
    this.formatting = options;
    return this;
  }
}

export class OutputItem {
  key?: string;
  value?: string;
  row?: number;
  column?: number;
  required?: boolean;
  skipIfEmpty?: boolean;
}

export class ReportOutput {
  currentRow = 0;
  errors: ValidationError[];
  output: OutputValue[] = [];
  rows = {};
  headerLines: number[] = [];
  totalLine = 0;
  columns = 0;

  addRow(row: number) {
    const outputRow = new OutputRow(row, this);
    this.rows[row] = outputRow;
    if (this.currentRow < row) {
      this.currentRow = row + 1;
    }
    return outputRow;
  }
  getRow(row: number): OutputRow {
    return this.rows[row];
  }
}

export class ReportState {
  errors: ValidationError[] = [];
}

export class CellValue {
  column: number;
  value: string;

  constructor(column?: number, value?: string) {
    this.column = column;
    this.value = value;
  }
}
