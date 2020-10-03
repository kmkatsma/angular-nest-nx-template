import {
  ReportOutput,
  ReportState,
  OutputItem,
  OutputValue,
  CellValue
} from './report-output';

export class OutputUtil {
  private static MISSING_AND_REQUIRED = 'Missing & Required';

  static convertOutputToAoA(report: ReportOutput) {
    const aoa = [];

    for (let i = 1; i <= report.currentRow; i++) {
      const rowArray = [];
      const rowCells = report.output.filter(p => p.row === i);
      const rowCellInfo = this.createRowCellsMap(rowCells);
      for (let c = 1; c <= rowCellInfo.maxColumn; c++) {
        const cellValue = rowCellInfo.map[c];
        if (cellValue) {
          rowArray.push(cellValue.value);
        } else {
          rowArray.push(undefined);
        }
      }
      aoa.push(rowArray);
    }
    return aoa;
  }

  static createRowCellsMap(list: OutputValue[]) {
    const map: Record<number, OutputValue> = {};
    let maxColumn = 0;
    list.forEach(l => {
      map[l.column] = l;
      if (l.column > maxColumn) {
        maxColumn = l.column;
      }
    });
    return { map, maxColumn };
  }

  static getError(con: ReportState, field: string) {
    const error = con.errors.find(p => p.property === field);
    if (error) {
      return error.value;
    } else {
      return '';
    }
  }

  static populateOutputItems(
    output: ReportOutput,
    outputConfig: OutputItem[][],
    data: ReportState
  ) {
    let incrementRow = false;
    outputConfig.forEach(rows => {
      incrementRow = true;
      rows.forEach(cell => {
        if (cell.skipIfEmpty && (!cell.value || !cell.key)) {
          incrementRow = false;
        } else {
          if (cell.value) {
            output.output.push(
              new OutputValue(output.currentRow, cell.column, cell.value)
            );
          } else {
            output.output.push(
              new OutputValue(output.currentRow, cell.column, data[cell.key])
            );
          }
        }
      });
      if (incrementRow) {
        output.currentRow++;
      }
    });
  }

  static populateDataset(
    output: ReportOutput,
    outputConfig: OutputItem[],
    data: ReportState,
    fieldNames: any,
    headerLineText?: string
  ) {
    if (headerLineText) {
      output.output.push(
        new OutputValue(output.currentRow++, 1, headerLineText)
      );
    }
    outputConfig.forEach(entry => {
      /*if (entry.row) {
        rowCount = entry.row;
      }*/
      this.createOutputRow(
        data,
        output,
        fieldNames[entry.key],
        data[entry.key],
        {
          errorIfUndefined: entry.required
        }
      );
    });
  }

  static writeCellValue(
    outputValues: ReportOutput,
    column: number,
    value: string
  ) {
    outputValues.output.push(
      new OutputValue(outputValues.currentRow, column, value)
    );
  }

  static writeRow(outputValues: ReportOutput, cellValues: CellValue[]) {
    cellValues.forEach(p => {
      outputValues.output.push(
        new OutputValue(outputValues.currentRow, p.column, p.value)
      );
    });
    outputValues.currentRow++;
  }

  static createOutputRow(
    data: ReportState,
    outputValues: ReportOutput,
    field: string,
    value: string,
    options?: { errorIfUndefined: boolean }
  ) {
    let missing = false;
    outputValues.output.push(
      new OutputValue(outputValues.currentRow, 1, field)
    );
    outputValues.output.push(
      new OutputValue(outputValues.currentRow, 2, value)
    );
    if (
      options &&
      options.errorIfUndefined &&
      (value === undefined || value === '')
    ) {
      outputValues.output.push(
        new OutputValue(outputValues.currentRow, 3, this.MISSING_AND_REQUIRED)
      );
      missing = true;
    }
    if (!missing) {
      outputValues.output.push(
        new OutputValue(
          outputValues.currentRow,
          3,
          OutputUtil.getError(data, field)
        )
      );
    }
    outputValues.currentRow++;
  }
}
