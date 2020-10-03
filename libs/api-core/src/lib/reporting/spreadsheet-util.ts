import {
  ReportPage,
  NumericColumn,
  ColumnTypeEnum,
  StringColumn
} from './report-definition';
import { ReferenceItem } from '@ocw/shared-models';
import * as Excel from 'exceljs';
import { Response } from 'express';
import * as path from 'path';

export const excelPath = `/assets/excel/`;

export class ColumnWidths {
  key: string;
  width: number;
}

export class SpreadsheetUtil {
  static setExcelResponseHeaders(res: Response, fileName: string) {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  }

  static createWorkbook(): Excel.Workbook {
    const workbook = new Excel.Workbook();
    return workbook;
  }

  static async getWorkbookFromFile(fileName: string): Promise<Excel.Workbook> {
    const workbook = new Excel.Workbook();
    const fullPath = path.join(__dirname, `${excelPath}${fileName}`);
    await workbook.xlsx.readFile(fullPath);
    workbook.clearThemes();
    return workbook;
  }

  static setColumnWidths(
    xlSheet: Excel.Worksheet,
    columnDefinitions: ColumnWidths[]
  ) {
    columnDefinitions.forEach(p => {
      xlSheet.columns[p.key].width = p.width;
    });
  }

  static buildNameString(selectItems: ReferenceItem[], ids: number[]): string {
    if (!ids) return '';

    let nameString = '';
    const matchingItems = selectItems.filter(p => ids.indexOf(p.uid) < 0);
    matchingItems.forEach(p => {
      if (nameString.length > 0) nameString += ', ';

      nameString += p.val;
    });
    return nameString;
  }

  public static autoFitColumns(
    xlSheet: ReportPage,
    row: number,
    column1: number,
    column2: number
  ) {
    for (let i = column1; i <= column2; i++) {
      const column = xlSheet.getSpreadsheetColumns()[i];
      if (column) {
        const value = xlSheet.getCell(row, i).value;
        if (value) {
          column.width = xlSheet.getCell(row, i).value.toString().length;
        }
        if (column.width < 12) {
          column.width = 12;
        }
      }
    }
  }

  public static getColumnIndex(page: ReportPage, columnKey: string) {
    let counter = 1;
    let columnIndex = 0;
    page.columns.forEach(col => {
      if (col.key === columnKey) {
        columnIndex = counter;
      }
      counter++;
    });
    return columnIndex;
  }

  public static autoFitAnyColumn(page: ReportPage, columnKey: string) {
    const columnIndex = this.getColumnIndex(page, columnKey);
    const workSheetColumn = page.getSpreadsheetColumns()[columnIndex - 1];
    const column = page.columns.get(columnKey);
    if (column.type === ColumnTypeEnum.string) {
      (column as StringColumn).values.forEach(p => {
        if (!workSheetColumn.width) {
          workSheetColumn.width = 12;
        }
        if (workSheetColumn.width < p.toString().length) {
          workSheetColumn.width = p.toString().length;
        }
      });
    }
    if (column.type !== ColumnTypeEnum.string) {
      (column as NumericColumn).values.forEach(p => {
        if (!workSheetColumn.width) {
          workSheetColumn.width = 12;
        }
        if (workSheetColumn.width < p.toString().length) {
          workSheetColumn.width = p.toString().length;
        }
      });
    }
  }

  public static autoFitColumn(page: ReportPage, columnKey: string) {
    const columnIndex = this.getColumnIndex(page, columnKey);
    const workSheetColumn = page.getSpreadsheetColumns()[columnIndex - 1];
    const column = page.columns.get(columnKey);
    (column as NumericColumn).values.forEach(p => {
      if (!workSheetColumn.width) {
        workSheetColumn.width = 12;
      }
      if (workSheetColumn.width < p.toString().length) {
        workSheetColumn.width = p.toString().length;
      }
    });
  }

  public static printColumnHeader(
    xlSheet: Excel.Worksheet,
    row: number,
    column: number,
    values: string[]
  ) {
    if (values.length === 1) {
      xlSheet.getCell(row, column).value = values[0];
    }
    if (values.length === 2) {
      xlSheet.getCell(row, column).value = values[1];
      xlSheet.getCell(row - 1, column).value = values[0];
    }
  }

  public static formatBold(
    xlSheet: Excel.Worksheet,
    row1: number,
    row2: number,
    column1: number,
    column2: number
  ) {
    for (let i = row1; i <= row2; i++) {
      for (let j = column1; j <= column2; j++) {
        xlSheet.getCell(i, j).font = { bold: true, size: 12 };
      }
    }
  }

  static formatTotalLine(
    xlSheet: Excel.Worksheet,
    row: number,
    column1: number,
    column2: number
  ) {
    for (let j = column1; j <= column2; j++) {
      xlSheet.getCell(row, j).border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };
    }
  }
}
