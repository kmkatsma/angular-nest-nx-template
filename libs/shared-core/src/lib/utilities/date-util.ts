import { MonthInfo } from './date.models';

export class DateUtil {
  static isValidTimestamp(timestamp: number) {
    const dt = new Date(timestamp).getTime();
    if (!dt || isNaN(dt)) {
      return false;
    } else {
      return true;
    }
  }

  static getLastDayOfMonth(month: number, year: number) {
    const d = new Date(year, month, 0);
    return d;
  }

  static isDate(value: string | number | Date) {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date.valueOf());
  }

  static convertExcelDateToTS(excelDate: number) {
    console.log('excelDate', excelDate);
    if (excelDate > 1000000000) {
      return excelDate;
    }
    return (excelDate - (25567 + 2)) * 86400;
  }

  static formatTimestamp(date: Date, includeTime: boolean) {
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
    const hours = d.getHours();
    const minutes = '0' + d.getMinutes();
    const seconds = '0' + d.getSeconds();
    let time = ' ' + hours + ':' + minutes + ':' + seconds + 'z';
    if (!includeTime) {
      time = ' 00:00:00z';
    }

    return [year, month, day].join('-') + time;
  }

  static formatDateNoTime(date: Date): string {
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

  static formatDateYYYYMMDD(date: Date): string {
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
    return `${year}-${month}-${day}`;
  }

  static addMonths(date: Date, months: number) {
    date.setMonth(date.getMonth() + months);
    return date;
  }

  static addDays(ts: number, days: number): number {
    return ts + days * 86400;
  }

  static addHours(ts: number, hours: number): number {
    return ts + hours * 3600;
  }

  static addMinutes(ts: number, minutes: number): number {
    return ts + minutes * 60;
  }

  static createBirthDate(age: number): number {
    const date = new Date();
    const bDate = new Date(date.getFullYear() - age, 1, 1);
    return this.convertDateToGMTTS(bDate);
  }

  static convertDateToGMTTS(dateObj: Date): number {
    return Math.round(
      Number(dateObj.setMinutes(dateObj.getTimezoneOffset() * -1)) / 1000
    );
  }

  static convertDateToLocalTS(dateObj: Date): number {
    return Math.round(Number(dateObj) / 1000);
  }

  static getGMTDateTsWithoutTimeFromDate(date: Date): number {
    const todayTs = DateUtil.convertDateToGMTTS(
      new Date(date.getFullYear(), date.getMonth(), date.getDate())
    );
    return todayTs;
  }

  static stringtoGMTTimestamp(dateString: string): number {
    if (!dateString) {
      return 0;
    } else {
      const dateObj = new Date(dateString);
      return this.getGMTDateTsWithoutTimeFromDate(dateObj);
    }
  }

  static toGMTTimestamp(dateObj: Date): number {
    if (!dateObj) {
      return undefined;
    }
    const localDate = new Date(dateObj.getTime());
    return Math.round(
      Number(localDate.setMinutes(localDate.getTimezoneOffset() * -1)) / 1000
    );
  }

  static TStoGMTDate(ts: number): Date {
    if (!ts || ts === 0) {
      return undefined;
    }
    const indate = new Date(ts * 1000);
    const date = new Date();
    date.setTime(indate.valueOf() + 60000 * indate.getTimezoneOffset());
    return date;
  }

  static getGMTDateTsWithoutTime(): number {
    const dateNow = new Date();
    const todayTs = DateUtil.convertDateToGMTTS(
      new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())
    );
    return todayTs;
  }
  static getGMTTimestamp(): number {
    const date = new Date();
    const ts = Math.round(date.getTime() / 1000);
    return ts;
  }

  static getGMTDateTs(): number {
    const date = new Date();
    const ts = Math.round(date.getTime() / 1000);
    return ts;
  }

  static convertTStoGMTDate(ts: number): Date {
    if (!ts || ts === 0) {
      return undefined;
    }
    const indate = new Date(ts * 1000);
    const date = new Date();
    date.setTime(indate.valueOf() + 60000 * indate.getTimezoneOffset());
    return date;
  }

  static getDayForTs(ts: number): number {
    const date = DateUtil.convertTStoGMTDate(ts);
    return date.getUTCDate();
  }

  static getMonthName(monthNumber: number) {
    if (monthNumber === undefined || monthNumber === null) {
      monthNumber = 0;
    }
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames[monthNumber - 1];
  }

  static getMonthAbbr(monthNumber: number) {
    return this.getMonthName(monthNumber).substr(0, 3);
  }

  static getMonthHistoryInfo(date: Date, months: number): MonthInfo[] {
    const monthList = [];
    const start = DateUtil.addMonths(date, -months);
    let currentDate = new Date(start.getFullYear(), start.getMonth(), 1);
    for (let i = 1; i <= months; i++) {
      const month = new MonthInfo();
      month.month = currentDate.getMonth() + 1;
      month.name = this.getMonthName(month.month);
      month.abbr = month.name.substr(0, 3);
      month.startTs = DateUtil.toGMTTimestamp(currentDate);
      currentDate = DateUtil.addMonths(currentDate, 1);
      month.endTs = DateUtil.toGMTTimestamp(currentDate) - 1;
      monthList.push(month);
    }
    return monthList;
  }

  static getMonthForTs(ts: number): number {
    const date = DateUtil.convertTStoGMTDate(ts);
    return date.getMonth() + 1;
  }

  static convertSecondsToDays(seconds: number): number {
    return Math.floor(seconds / (3600 * 24));
  }

  static getYearForTs(ts: number): number {
    const date = DateUtil.convertTStoGMTDate(ts);
    return date.getFullYear();
  }

  static convertTStoDate(ts: number): Date {
    if (!ts || ts === 0) {
      return undefined;
    }
    const indate = new Date(ts * 1000);
    return indate;
  }

  static dateDiff(type: string, date1: number, date2: number): number {
    if (type === 'd') {
      //test
      const difference = date2 - date1;
      const daysDifference = difference / 86400;
      return daysDifference;
    }
    if (type === 'y') {
      const difference = date2 - date1;
      const yearDifference = difference / (86400 * 365.25);
      return yearDifference;
    }
    return 0;
  }

  static TranslateDateStringToGMT(date: string, fieldName: string) {
    const dt = new Date(date);
    const ts = DateUtil.convertDateToGMTTS(dt);
    return ts;
    if (isNaN(ts)) {
      return 0;
    } else {
      return ts;
    }
  }

  static formatDateFromTs(ts: number): string {
    if (!ts) {
      return '';
    }
    const d = this.TStoGMTDate(ts);
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
}
