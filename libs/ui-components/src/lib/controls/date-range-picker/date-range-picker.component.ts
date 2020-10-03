import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LogService } from '@ocw/ui-core';
import { Subject } from 'rxjs';
import { FormControlService } from '../../forms/form-control.service';

@Component({
  selector: 'ocw-date-range-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="form" [formGroup]="form" fxLayout="row wrap" fxLayoutGap="16px">
      <div>
        <ocw-datepicker
          [style]="{ 'min-width.px': 300 }"
          placeHolder="Start Date"
          [formControlName]="startDateControlName"
          [required]="true"
        ></ocw-datepicker>
      </div>
      <div>
        <ocw-datepicker
          [style]="{ 'min-width.px': 300 }"
          placeHolder="End Date"
          [formControlName]="endDateControlName"
          [required]="false"
        ></ocw-datepicker>
      </div>

      <div *ngIf="dateRangeTypeControlName" fxLayout="row" fxLayoutGap="20px">
        <mat-form-field style="min-width: 300px">
          <mat-select
            placeholder="Date Type"
            [formControlName]="dateRangeTypeControlName"
            #dateRangeType
          >
            <mat-option matInput value="1" style="padding-bottom: 5px"
              >POSTING DATE</mat-option
            >
            <mat-option matInput value="2" style="padding-bottom: 5px"
              >SERVICE DATE</mat-option
            >
          </mat-select>
        </mat-form-field>
      </div>
    </div>
  `,
})
export class DateRangePickerComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() startDateControlName: string;
  @Input() endDateControlName: string;
  @Input() dateRangeTypeControlName: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public logService: LogService,
    public formService: FormControlService
  ) {}

  ngOnDestroy() {
    this.logService.debug('ngOnDestroy', this);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {}
}
