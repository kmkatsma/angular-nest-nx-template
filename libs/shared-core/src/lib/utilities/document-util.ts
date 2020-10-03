import { StringUtil } from './string-util';
import * as R from 'rambda';
import { DateUtil } from './date-util';

export class DocumentUtil {
  static readValue(doc: any, path: string[]): string {
    return StringUtil.undefinedToEmpty(R.path(path, doc));
  }

  static readDateValue(doc: any, path: string[]): string {
    const value = Number(this.readValue(doc, path));
    const date = DateUtil.TStoGMTDate(value);
    const formattedDate = DateUtil.formatDateNoTime(date);
    return formattedDate;
  }
}
