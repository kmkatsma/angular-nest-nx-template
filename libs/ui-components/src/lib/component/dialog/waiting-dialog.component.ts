import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LogService } from '@ocw/ui-core';

@Component({
  selector: 'ocw-waiting-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-spinner class="spinner" aria-label="loading"></mat-spinner>
  `,
})
export class WaitingDialogComponent implements OnInit {
  constructor(
    public logService: LogService,
    public dialogRef: MatDialogRef<WaitingDialogComponent>
  ) {}

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }
}
