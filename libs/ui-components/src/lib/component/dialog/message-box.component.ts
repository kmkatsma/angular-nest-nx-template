import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';

@Component({
  selector: 'ocw-message-box',
  template: `
    <div
      style="font-family: Roboto, Helvetica Neue, sans-serif; font-size: 18px"
      *ngIf="title"
    >
      {{ title.toUpperCase() }}
    </div>
    <div
      style="font-family: Roboto, Helvetica Neue, sans-serif; margin-bottom: 24px"
    >
      {{ message }}
    </div>
    <div
      *ngFor="let item of messages"
      style="font-family: Roboto, Helvetica Neue, sans-serif; margin-bottom: 24px"
    >
      {{ item }}
    </div>
    <div
      class="ocw-pl-10"
      style="display: flex; justify-content: flex-end;  margin: -16px"
    >
      <div style="margin-left:100px"></div>
      <button
        *ngIf="cancelText"
        type="button"
        mat-button
        color="primary"
        (click)="dialogRef.close()"
      >
        {{ cancelText }}
      </button>
      <button
        type="button"
        mat-button
        color="primary"
        (click)="dialogRef.close(true)"
      >
        {{ okText }}
      </button>
    </div>
  `,
})
export class MessageBoxComponent {
  public title: string;
  public message: string;
  public okText: string;
  public cancelText: string;
  public messages: string[];

  constructor(public dialogRef: MatDialogRef<MessageBoxComponent>) {}
}
