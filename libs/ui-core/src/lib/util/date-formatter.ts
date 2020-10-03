import { DatePipe } from '@angular/common';

const datePipe = new DatePipe('en-US');

export class DateFormatter {
static formatDate(date: Date): string {
  return datePipe.transform(date, 'MM/dd/yyyy');
}

static formatDateTime(date: Date): string {
  if (date) {
    return datePipe.transform(date, 'MM/dd/yyyy h:mm:ss a');
  } else {
    return '';
  }
}

}