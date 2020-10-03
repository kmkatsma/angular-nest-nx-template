export class ReportDataColumn {}

export class ReportStringColumn extends ReportDataColumn {
  [values: number]: string;
}

export class ReportIntColumn extends ReportDataColumn {
  [values: number]: number;
}

export class ReportDoubleColumn extends ReportDataColumn {
  [values: number]: number;
}

export class RowKeyValue {
  public id: number;
  public description: string;
}
