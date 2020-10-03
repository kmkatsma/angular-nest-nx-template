import { Injectable } from '@angular/core';
import { ReferenceValue } from '@ocw/shared-models';
import { DateUtil } from '@ocw/shared-core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor() {}

  getMonths(): ReferenceValue[] {
    const months: ReferenceValue[] = [
      { uid: 1, val: 'January' },
      { uid: 2, val: 'February' },
      { uid: 3, val: 'March' },
      { uid: 4, val: 'April' },
      { uid: 5, val: 'May' },
      { uid: 6, val: 'June' },
      { uid: 7, val: 'July' },
      { uid: 8, val: 'August' },
      { uid: 9, val: 'September' },
      { uid: 10, val: 'October' },
      { uid: 11, val: 'November' },
      { uid: 12, val: 'December' },
    ];
    return months;
  }

  getYears(): ReferenceValue[] {
    const years = new Array<ReferenceValue>();
    const currentYear = new Date().getFullYear();
    years.push(new ReferenceValue(currentYear, currentYear.toString()));
    for (let i = 1; i < 5; i++) {
      years.push(
        new ReferenceValue(currentYear - i, (currentYear - i).toString())
      );
    }
    return years;
  }

  getDefaultYear(): number {
    return new Date().getFullYear();
  }

  getDefaultMonth(): number {
    return new Date().getMonth() + 1;
  }

  getDefaultStart(monthsInPast: number): number {
    return DateUtil.convertDateToGMTTS(
      DateUtil.addMonths(new Date(), -monthsInPast)
    );
  }
}
