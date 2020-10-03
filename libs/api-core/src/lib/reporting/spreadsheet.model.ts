import * as Excel from 'exceljs';
import { OutputUtil } from './output-util';
import { Response } from 'express';
import { ReportOutput, OutputRow } from './report-output';

class ColumnFormat {
  constructor(public width: number) {}
}

export interface IReportBuilder {
  buildReport(workbook: SpreadsheetReport);
}

export class SpreadsheetReport {
  private workbook: Excel.Workbook;

  constructor(workbook?: Excel.Workbook) {
    if (!workbook) {
      this.workbook = new Excel.Workbook();
    } else {
      this.workbook = workbook;
    }
  }

  addSheet(name: string) {
    return this.workbook.addWorksheet(name);
  }

  getSheet(name: string) {
    return this.workbook.getWorksheet(name);
  }

  mergeCells(sheet: string, cells: string) {
    const worksheet = this.workbook.getWorksheet(sheet);
    worksheet.mergeCells(cells);
  }

  cloneSheet(sourceSheet: string, targetSheet: string) {
    const sheetToClone = this.workbook.getWorksheet(sourceSheet);
    const cloneSheet = this.workbook.addWorksheet('Sheet');

    cloneSheet.model = sheetToClone.model;
    cloneSheet.name = targetSheet;
  }

  writeDataToSheet(
    name: string,
    reportOutput: ReportOutput,
    formatOptions?: { startRow: number; minWidth?: number }
  ) {
    const worksheet = this.workbook.getWorksheet(name);

    const ws_data = OutputUtil.convertOutputToAoA(reportOutput);
    let row = 1;
    const columnDataLengths: ColumnFormat[] = [];
    ws_data.forEach(p => {
      const reportRow = reportOutput.getRow(row);
      const excelRow = worksheet.getRow(row);
      for (let i = 0; i < p.length; i++) {
        const cell = excelRow.getCell(i + 1);
        cell.value = p[i];
        if (formatOptions && formatOptions.startRow <= row) {
          if (columnDataLengths.length < i + 1) {
            if (formatOptions.minWidth) {
              columnDataLengths.push(new ColumnFormat(formatOptions.minWidth));
            } else {
              columnDataLengths.push(new ColumnFormat(10));
            }
          }
          if (
            cell.value &&
            cell.value.toString().length > columnDataLengths[i].width
          ) {
            columnDataLengths[i].width = cell.value.toString().length;
          }
          this.formatCell(cell, reportRow);
        }
      }
      row++;
    });
    console.log('column lengths', columnDataLengths);
    if (columnDataLengths.length > 0) {
      worksheet.columns = columnDataLengths;
    }
  }

  setColumnWidths(name: string, widths: any[]) {
    const worksheet = this.workbook.getWorksheet(name);
    worksheet.columns = widths;
  }

  buildSheet(builder: IReportBuilder) {
    builder.buildReport(this);
  }

  async writeToResponse(res: Response, fileName: string) {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    await this.workbook.xlsx.write(res);
  }

  formatCell(cell: Excel.Cell, row: OutputRow) {
    if (!row.formatting) {
      return;
    }
    this.setFont(cell, row.formatting.fontSize, row.formatting.bold);
    this.setBorder(cell, row.formatting.topBorder, row.formatting.bottomBorder);
    this.setFill(cell, row.formatting.fill);
  }
  setFont(cell: Excel.Cell, fontSize: number, bold: boolean) {
    if (!fontSize && !bold) {
      return;
    }
    const font = {};
    if (fontSize) {
      font['size'] = fontSize;
    }
    if (bold) {
      font['bold'] = true;
    }
    cell.font = font;
  }

  setBorder(cell: Excel.Cell, topBorder: boolean, bottomBorder) {
    if (!topBorder && !bottomBorder) {
      return;
    }
    const border = {};
    if (topBorder) {
      border['top'] = { style: 'thin' };
    }
    if (bottomBorder) {
      border['bottom'] = { style: 'thin' };
    }
    cell.border = border;
  }

  setFill(cell: Excel.Cell, fill: boolean) {
    if (!fill) {
      return;
    }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
  }
}
