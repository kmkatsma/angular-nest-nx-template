import * as R from 'rambda';
import { DateUtil } from './date-util';
import { StringUtil } from './string-util';

export class DocumentReader<T> {
  constructor(public doc?: T) {}

  setDocument(doc: T, refData?: any, refData2?: any) {
    this.doc = doc;
  }

  readValue(path: string[]): string {
    return StringUtil.undefinedToEmpty(R.path(path, this.doc));
  }
  readNumberValue(path: string[]): number {
    const value = R.path(path, this.doc);
    if (value === null || value === undefined) {
      return 0;
    }
    return value as number;
  }

  readDateValue(path: string[]): string {
    const value = Number(this.readValue(path));
    const date = DateUtil.TStoGMTDate(value);
    const formattedDate = DateUtil.formatDateNoTime(date);
    return formattedDate;
  }

  readTimestampValue(path: string[]): string {
    const value = Number(this.readValue(path));
    const date = DateUtil.TStoGMTDate(value);
    const formattedDate = DateUtil.formatTimestamp(date, false);
    console.log('readTimestampValue', formattedDate);
    return formattedDate;
  }

  readCoalescedValue(jsonPaths: string[]) {
    let value: any;
    for (let i = 0; i < jsonPaths.length; i++) {
      const fieldColumn = jsonPaths[i];
      const coaleseFieldSplit = fieldColumn.split('.');
      value = R.path(coaleseFieldSplit, this.doc);
      if (value) {
        break;
      }
    }
    return value;
  }
}
