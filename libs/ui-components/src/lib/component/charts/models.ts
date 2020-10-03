import { ChartType, Column } from 'angular-google-charts';

export interface ChartInfo {
  title?: string;
  type?: ChartType;
  data: any[][];
  columns?: Column[];
  options?: {};
}

export class ChartEvent<T> {
  data: T;
}
