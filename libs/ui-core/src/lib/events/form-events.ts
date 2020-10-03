export enum FormEventType {
  Cancel = 1,
  Add = 2,
  Update = 3,
  Delete = 4,
  Print = 5,
  Init = 6,
  Save = 7
}

export class FormEvent<T> {
  constructor(
    public data: T,
    public resourceEnum: number,
    public eventType: FormEventType,
    public mode?: string
  ) {}
}
