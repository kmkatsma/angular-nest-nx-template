import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { Workbook } from 'exceljs';
import { DataTableService } from './data-table.service';
import { ColumnDefinition } from '@ocw/shared-models';

@Injectable({
  providedIn: 'root',
})
export class DataTablePrintService {
  constructor(private dataTableService: DataTableService) {}

  print(dataList: any[], dataColumns: ColumnDefinition[], fileName: string) {
    if (dataList) {
      const workbook: Workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Page 1');

      const data = this.dataTableService.transformData(dataList, dataColumns);
      console.log(data);
      const titleRow = [];
      const fields = [];
      const columns = [];
      dataColumns.forEach((p) => {
        if (!p.hideAll) {
          titleRow.push(p.cdkHeaderCellDef);
          fields.push(p.cdkColumnDef);
          columns.push({ width: 20 });
        }
      });
      worksheet.columns = columns;
      const title = worksheet.addRow(titleRow, 'n');
      title.eachCell(function (cell, colNumber) {
        cell.font = {
          bold: true,
        };
        cell.border = {
          bottom: { style: 'thin' },
        };
      });
      data.forEach((p) => {
        const rowValues = [];
        fields.forEach((field) => {
          rowValues.push(p[field]);
        });
        worksheet.addRow(rowValues, 'n');
      });

      workbook.xlsx.writeBuffer().then(function (dataToWrite: any) {
        const blob = new Blob([dataToWrite], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, 'fileName.xlsx');
      });
    }
  }

  exportToExcel(sourceData: any[], sourceColumns: any) {
    if (sourceData) {
      const workbook: Workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Page 1');

      const data = this.dataTableService.transformData(
        sourceData,
        sourceColumns
      );
      console.log(data);
      const titleRow = [];
      const fields = [];
      const columns = [];
      sourceColumns.forEach((p) => {
        if (!p.hideAll) {
          titleRow.push(p.cdkHeaderCellDef);
          fields.push(p.cdkColumnDef);
          columns.push({ width: 20 });
        }
      });
      worksheet.columns = columns;
      const title = worksheet.addRow(titleRow, 'n');
      title.eachCell(function (cell, colNumber) {
        cell.font = {
          bold: true,
        };
        cell.border = {
          bottom: { style: 'thin' },
        };
      });
      data.forEach((p) => {
        const rowValues = [];
        fields.forEach((field) => {
          rowValues.push(p[field]);
        });
        worksheet.addRow(rowValues, 'n');
      });

      workbook.xlsx.writeBuffer().then(function (inputData) {
        const blob = new Blob([inputData], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, 'fileName.xlsx');
      });
    }
  }
}
