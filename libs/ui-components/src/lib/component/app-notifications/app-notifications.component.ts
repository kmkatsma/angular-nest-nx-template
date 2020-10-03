import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ValidationStatus } from '@ocw/shared-models';

@Component({
  selector: 'ocw-app-notifications',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-list
      color="warn"
      style="margin: 0px"
      *ngIf="validationResults && validationResults.messages.length > 0"
    >
      <mat-list-item
        style="background-color: lightcoral;"
        *ngFor="let error of validationResults.messages"
      >
        <div style="min-width:150px">{{ error.source }}</div>
        <mat-divider [vertical]="true"></mat-divider>
        <div>{{ error.message }}</div>
        <mat-divider></mat-divider>
      </mat-list-item>
    </mat-list>
  `,
})
export class AppNotificationsComponent implements OnInit {
  @Input() validationResults: ValidationStatus;

  constructor() {}

  ngOnInit() {}
}
