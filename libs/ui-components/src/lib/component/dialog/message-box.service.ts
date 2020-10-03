import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { MessageBoxComponent } from './message-box.component';
import { ResponseError } from '@ocw/shared-models';

@Injectable()
export class MessageBoxService {
  isOpen = false;
  constructor(private dialog: MatDialog) {}

  public setClosed() {
    console.log('errors setClosed');
    this.isOpen = false;
  }

  public confirm(
    title: string,
    message: string,
    okText: string,
    cancelText: string
  ): Observable<boolean> {
    let dialogRef: MatDialogRef<MessageBoxComponent>;
    console.log('confirm', this.isOpen);
    if (this.isOpen) {
      return of(false);
    }
    dialogRef = this.dialog.open(MessageBoxComponent, { disableClose: true });
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.okText = okText;
    dialogRef.componentInstance.cancelText = cancelText;
    this.isOpen = true;
    return dialogRef.afterClosed();
  }

  public confirmErrors(
    title: string,
    errors: ResponseError[],
    okText: string,
    cancelText: string
  ): Observable<boolean> {
    let dialogRef: MatDialogRef<MessageBoxComponent>;
    console.log('errors', errors, this.isOpen);
    const message = '';
    const messages = [];
    errors.forEach(error => {
      messages.push(error.message);
    });

    if (this.isOpen) {
      return of(false);
    }

    dialogRef = this.dialog.open(MessageBoxComponent, { disableClose: true });
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.messages = messages;
    dialogRef.componentInstance.okText = okText;
    dialogRef.componentInstance.cancelText = cancelText;
    this.isOpen = true;

    return dialogRef.afterClosed();
  }
}
