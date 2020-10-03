import { Injectable } from '@angular/core';
import { MessageBoxService } from '@ocw/ui-components';
import { StatusPayload, SystemMessageType, LogService } from '@ocw/ui-core';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  constructor(
    private logService: LogService,
    private snackBar: MatSnackBar,
    private messageBoxService: MessageBoxService
  ) {}

  displayStatus(status: StatusPayload) {
    console.log('displayStatus called: errorId', JSON.stringify(status));
    if (status && status.message && status.message.length > 0) {
      const config = new MatSnackBarConfig();
      if (
        status.messageType === SystemMessageType.Information ||
        status.messageType === undefined
      ) {
        config.duration = 1000;
        this.snackBar.open(status.message, null, config);
      } else if (status.messageType === SystemMessageType.Validation) {
        this.messageBoxService.confirm('', status.message, 'OK', '');
      } else {
        if (status.errors && status.errors.length > 0) {
          this.messageBoxService
            .confirmErrors('Validation Errors', status.errors, 'OK', '')
            .subscribe(res => {
              console.log('res dialog errors < 150', res);
              if (res === true) {
                this.messageBoxService.setClosed();
              }
            });
          return;
        }
        if (status.message.length > 150) {
          this.messageBoxService
            .confirm('', status.message, 'OK', '')
            .subscribe(res => {
              console.log('res dialog errors > 150', res);
              if (res === true) {
                this.messageBoxService.setClosed();
              }
            });
        } else {
          this.snackBar.open(status.message, 'OK', config);
        }
      }
    }
  }
}
