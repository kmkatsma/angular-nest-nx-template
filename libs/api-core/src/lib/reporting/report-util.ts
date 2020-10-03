import { ReferenceValue, ReferenceItem } from '@ocw/shared-models';
import {
  ReportPage,
  ColumnTypeEnum,
  NumericColumn,
  StringColumn,
  ReportFieldConstants,
} from './report-definition';
import { SpreadsheetUtil } from './spreadsheet-util';
import * as Excel from 'exceljs';
import { SpreadsheetReport } from './spreadsheet.model';

export type GetValueFunction = () => string;
export class ColumnValueDefinition {
  column: number;
  value: GetValueFunction;
}

export class ReportUtil {
  static printPageRowColumns(
    key: string | number,
    rowIndex: number,
    page: ReportPage
  ) {
    let columnIndex = 1;

    page.columns.forEach((column) => {
      if (column.type === ColumnTypeEnum.int) {
        const value = (column as NumericColumn).values.get(key);
        if (value) {
          page.getCell(rowIndex, columnIndex).value = value;
        } else {
          page.getCell(rowIndex, columnIndex).value = 0;
        }
      }
      if (column.type === ColumnTypeEnum.double) {
        const value = (column as NumericColumn).values.get(key);
        //console.log('column', column, value, rowIndex);
        if (value) {
          page.getCell(rowIndex, columnIndex).value = Number(value.toFixed(2));
        } else {
          page.getCell(rowIndex, columnIndex).value = 0;
        }
      }
      if (column.type === ColumnTypeEnum.string) {
        const value = (column as StringColumn).values.get(key);
        if (value) {
          page.getCell(rowIndex, columnIndex).value = value;
        }
        //TODO: autofit logic
        if (column.autofit) {
          // page.getColumns()
        }
      }
      columnIndex++;
    });
  }

  static printTotals(columns: string[], rowIndex: number, page: ReportPage) {
    let columnIndex = 1;
    page.columns.forEach((column) => {
      columns.forEach((key) => {
        if (column.key === key) {
          page.getCell(rowIndex, columnIndex).value = page.getColumnTotal(key);
        }
      });
      columnIndex++;
    });
  }

  public static printColumnHeaderForPage(
    page: ReportPage,
    row: number,
    column: number,
    values: string[]
  ) {
    if (!values) {
      return;
    }
    if (values.length === 1) {
      page.getCell(row, column).value = values[0];
    }
    if (values.length === 2) {
      page.getCell(row, column).value = values[1];
      page.getCell(row - 1, column).value = values[0];
    }
  }

  public static printCells(page: ReportPage, fieldValues: Map<string, string>) {
    const cells = page.definition.cells;
    if (!cells) {
      return;
    }

    cells.forEach((cell) => {
      let value: any;
      if (cell.value) {
        value = cell.value;
      }
      if (cell.placeHolder) {
        value = fieldValues.get(cell.placeHolder);
      }
      if (cell.placeHolder === ReportFieldConstants.REPORT_DATE) {
        value = 'Report Date: ' + this.formatDate(new Date());
      }
      page.getCell(cell.row, cell.column).value = value;
      if (cell.font) {
        page.getCell(cell.row, cell.column).font = cell.font;
      }
    });
  }

  public static printHeaders(page: ReportPage) {
    let column = page.definition.startColumn;
    page.definition.columns.forEach((element) => {
      this.printColumnHeaderForPage(
        page,
        page.definition.startRow,
        column,
        element.headers
      );
      column++;
    });

    const row = page.definition.startRow;
    this.formatHeaders(
      page,
      page.definition.startRow - 1,
      page.definition.startRow,
      1,
      column
    );
    SpreadsheetUtil.autoFitColumns(page, row, 1, column);
  }

  static printRow(
    worksheet: Excel.Worksheet,
    row: number,
    columnValues: ColumnValueDefinition[]
  ) {
    columnValues.forEach((element) => {
      worksheet.getCell(row, element.column).value = element.value();
    });
  }

  public static formatHeaders(
    xlSheet: ReportPage,
    row1: number,
    row2: number,
    column1: number,
    column2: number
  ) {
    for (let i = row1; i <= row2; i++) {
      for (let j = column1; j <= column2; j++) {
        xlSheet.getCell(i, j).font = { bold: true, size: 12 };
        if (i === row1) {
          xlSheet.getCell(i, j).border = {
            top: { style: 'thin' },
          };
        }
        if (i === row2) {
          xlSheet.getCell(i, j).border = {
            bottom: { style: 'thin' },
          };
        }

        xlSheet.getCell(i, j).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD3D3D3' },
        };
      }
    }
  }

  public static addBorders(
    report: SpreadsheetReport,
    sheetName: string,
    row1: number,
    row2: number,
    column1: number,
    column2: number
  ) {
    const xlSheet = report.getSheet(sheetName);
    for (let i = row1; i <= row2; i++) {
      for (let j = column1; j <= column2; j++) {
        console.log('i, j', i, j);
        xlSheet.getCell(i, j).font = { bold: true, size: 12 };
        if (i === row1) {
          xlSheet.getCell(i, j).border = {
            top: { style: 'thin' },
          };
        }
        if (i === row2) {
          xlSheet.getCell(i, j).border = {
            bottom: { style: 'thin' },
          };
        }
      }
    }
  }

  static getPrintDateString(label: string): string {
    return label + ' ' + this.formatDate(new Date());
  }

  static formatDate(date: Date): string {
    if (!date) {
      return '';
    }
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return `${month}/${day}/${year}`;
  }

  static translateReference(
    id: number,
    referenceItems: ReferenceItem[]
  ): string {
    const value = referenceItems.find((p) => p.uid === id);
    if (value) {
      return value.val;
    }
    return '';
  }

  static referenceValue(refVal: ReferenceValue): string {
    if (!refVal) {
      return '';
    } else {
      return refVal.val;
    }
  }

  static entityValue(refVal: any, property: string): string {
    if (!refVal) {
      return '';
    } else {
      if (refVal[property]) {
        return refVal[property];
      } else {
        return '';
      }
    }
  }

  static percent(numerator: number, denominator: number, decimals?: number) {
    if (!decimals) {
      decimals = 2;
    }
    if (denominator === 0) {
      return '0%';
    }
    const val = ((numerator / denominator) * 100).toFixed(decimals);
    return `${val}%`;
  }
}
