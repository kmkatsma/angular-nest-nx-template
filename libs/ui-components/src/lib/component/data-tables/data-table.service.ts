import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DateUtil, StringUtil } from '@ocw/shared-core';
import {
  ColumnDataType,
  ColumnDefinition,
  ReferenceValueAttribute,
} from '@ocw/shared-models';
import { DateFormatter, LogService, ReferenceDataUtil } from '@ocw/ui-core';
import * as R from 'rambda';

@Injectable({
  providedIn: 'root',
})
export class DataTableService {
  constructor(private logService: LogService) {}

  mapDatasetColumns(data: any[]) {
    const columns: ColumnDefinition[] = [];
    if (data.length === 0) {
      return columns;
    }
    Object.keys(data[0]).forEach((key) => {
      const column = new ColumnDefinition();
      column.fieldName = key;
      column.dataType = ColumnDataType.string;
      column.cdkColumnDef = column.cdkHeaderCellDef = key;
      columns.push(column);
    });
    return columns;
  }

  mapObjectToColumns(data: any, overrides?: Map<string, ColumnDefinition>) {
    const columns: ColumnDefinition[] = [];
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      if (overrides) {
        const val = overrides.get(keys[i]);
        if (val) {
          columns.push(val);
          continue;
        }
      }
      const column = new ColumnDefinition();
      column.fieldName = keys[i];
      if (column.fieldName.endsWith('Date')) {
        column.dataType = ColumnDataType.SystemDate;
      } else {
        column.dataType = ColumnDataType.string;
      }
      column.cdkColumnDef = column.cdkHeaderCellDef = keys[i];
      columns.push(column);
    }

    this.logService.log('mapObjectToColumns', data, columns);
    return columns;
  }

  transformData(data: any[], columns: ColumnDefinition[]) {
    this.logService.log('start transform', new Date());
    const newData = [];
    let i: number;
    let columnIndex: number;
    let row = {};
    for (i = 0; i < data.length; i++) {
      row = {};
      //this.logService.log('data', i, data[i]);
      for (columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        row[columns[columnIndex].cdkColumnDef] = this.getValue(
          data[i],
          columns[columnIndex]
        );
      }
      newData.push(row);
    }
    return newData;
  }

  transformDataset(data: any[], columns: ColumnDefinition[]) {
    this.logService.log('start transform', data);
    const newData = [];
    let i: number;
    let columnIndex: number;
    let row = {};
    for (i = 0; i < data.length; i++) {
      row = {};
      //this.logService.log('data', i, data[i]);
      for (columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        row[columns[columnIndex].cdkColumnDef] = this.getValue(
          data[i],
          columns[columnIndex]
        );
      }
      if (data[i]['document']) {
        row['document'] = data[i]['document'];
      } else {
        row['document'] = data[i];
      }
      newData.push(row);
    }
    this.logService.log('end transform', newData, new Date());
    return new MatTableDataSource<any>(newData);
  }

  getValue(data: any, column: ColumnDefinition): string {
    let value: any;

    if (column.dataType === ColumnDataType.Coalesced) {
      const fieldColumns = column.fieldName.split(',');
      for (let i = 0; i < fieldColumns.length; i++) {
        value = data[column.fieldName];
        const fieldColumn = fieldColumns[i];
        const coaleseFieldSplit = fieldColumn.split('.');
        value = R.path(coaleseFieldSplit, data);
        if (value) {
          break;
        }
      }
      return value;
    }

    const nameSplit = column.fieldName.split('.');
    value = R.path(nameSplit, data);
    if (column.dataType === ColumnDataType.Button) {
      return undefined;
    }
    if (column.dataType === ColumnDataType.ArrayElement) {
      if (column.arrayIndex !== undefined && column.arrayIndex !== null) {
        if (data[column.arrayPropertyName]) {
          if (data[column.arrayPropertyName][column.arrayIndex]) {
            value =
              data[column.arrayPropertyName][column.arrayIndex][
                column.fieldName
              ];
          }
        }
      }
    }
    if (column.dataType === ColumnDataType.Note) {
      if (value && value.length > 0) {
        return '*';
      } else {
        return undefined;
      }
    }
    if (column.dataType === ColumnDataType.Object) {
      return JSON.stringify(value);
    }
    if (column.dataType === ColumnDataType.SystemDate) {
      if (!value) {
        return undefined;
      }
      if (value > 0) {
        value = DateUtil.formatDateNoTime(DateUtil.TStoGMTDate(value));
      } else {
        return undefined;
      }
      return value;
    }
    if (column.dataType === ColumnDataType.TimestampDate) {
      if (!value) {
        return undefined;
      }
      if (value > 0) {
        value = DateFormatter.formatDate(new Date(value * 1000));
      } else {
        return undefined;
      }
      return value;
    }
    if (column.dataType === ColumnDataType.SystemDateTime) {
      if (!value) {
        return undefined;
      }
      if (value > 0) {
        value = DateFormatter.formatDateTime(new Date(value * 1000));
      } else {
        return undefined;
      }
      return value;
    }
    if (column.dataType === ColumnDataType.ReferenceValue) {
      if (!value) {
        return undefined;
      }
      if (value['val']) {
        return value['val'];
      }
      return value;
    }
    if (column.dataType === ColumnDataType.Boolean) {
      value = data[column.fieldName];
      if (value) {
        return 'Yes';
      } else {
        return 'No';
      }
    }
    if (column.dataType === ColumnDataType.Currency) {
      value = data[column.fieldName];
      if (value) {
        return StringUtil.formatCurrencyField(value);
      } else {
        return '$0';
      }
    }
    if (column.dataType === ColumnDataType.Date) {
      value = this.formatDate(value);
      return value;
    }
    if (column.dataType === ColumnDataType.Count) {
      if (value && value.length) {
        value = value.length;
        return value;
      } else {
        return '0';
      }
    }
    if (column.dataType === ColumnDataType.EnumMap && column.enumMap) {
      value = column.enumMap.get(value);
    }
    if (column.dataType === ColumnDataType.Domain) {
      const match = ReferenceDataUtil.getReferenceItem(
        column.domainAttribute,
        value
      );
      if (match) {
        value = match[ReferenceValueAttribute.val];
      }
    }
    if (column.dataType === ColumnDataType.DomainList) {
      const description = ReferenceDataUtil.buildDescriptionList(
        column.domainAttribute,
        value
      );
      if (description) {
        value = description;
      }
    }
    if (column.dataType === ColumnDataType.number) {
      if (value === undefined || value === null) {
        value = 0;
      }
      value = value.toFixed(2);
    }
    if (column.dataType === ColumnDataType.Integer) {
      if (value === undefined || value === null) {
        value = 0;
      }
      value = value;
    }
    if (column.dataType === ColumnDataType.DurationDays) {
      if (value === undefined || value === null) {
        value = 0;
      }
      value = DateUtil.convertSecondsToDays(value);
    }
    return value;
  }

  formatDate(date: Date): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'MM/dd/yyyy');
  }
}
