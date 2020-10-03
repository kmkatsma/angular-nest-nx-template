import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class InputDialogData<T> {
  title: string;
  text: string;
  value: T;
  placeHolder: string;
}

@Component({
  selector: 'ocw-input-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <mat-dialog-content>
      <div
        style="font-family: Roboto, Helvetica Neue, sans-serif; margin-bottom: 16px"
      >
        {{ data.text }}
      </div>
      <mat-form-field class="case-field">
        <input
          type="number"
          matInput
          [placeholder]="data.placeHolder"
          maxlength="3"
          [(ngModel)]="data.value"
        />
      </mat-form-field>
    </mat-dialog-content>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">CANCEL</button>
      <button mat-button [mat-dialog-close]="data" cdkFocusInitial>OK</button>
    </div>
  `,
})
export class InputDialogComponent<T> {
  constructor(
    public dialogRef: MatDialogRef<InputDialogComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public data: InputDialogData<T>
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
