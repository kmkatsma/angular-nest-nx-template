import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddressReferenceData } from '@ocw/shared-models';
import { Subject } from 'rxjs';
import { LogService, AppStoreService } from '@ocw/ui-core';
import { MatSelect } from '@angular/material/select';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControlService } from '../../../forms/form-control.service';

@Component({
  selector: 'ocw-city-selection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="form && addressDomains" [formGroup]="form" fxLayout="row">
      <mat-form-field style="min-width: 300px" fxFlex>
        <mat-select
          placeholder="Towns"
          [formControlName]="controlName"
          multiple
          #townsSelect
        >
          <mat-select-trigger>
            <span>{{ selectedTowns }}</span>
          </mat-select-trigger>
          <mat-option
            *ngFor="let city of addressDomains.cities"
            [value]="city[valueField]"
            >{{ city.val }}</mat-option
          >
        </mat-select>
      </mat-form-field>
      <mat-checkbox
        type="checkbox"
        id="selectAllTowns"
        [formControlName]="selectAllControlName"
        (click)="selectAll(townsSelect)"
        style="margin-left:16px; min-width: 113px; padding-top:10px"
        >Select All</mat-checkbox
      >
    </div>
    <div *ngIf="dialogRef" style="margin-top: 8px" fxLayout="row">
      <div fxFlex></div>
      <button type="button" color="primary" mat-button (click)="cancel()">
        OK
      </button>
    </div>
  `,
})
export class CitySelectionComponent implements OnInit, OnDestroy, OnChanges {
  @Input() form: FormGroup;
  @Input() controlName = 'town';
  @Input() selectAllControlName = 'selectAllTowns';
  @Input() addressDomains: AddressReferenceData;
  @Input() valueField = 'uid';
  @Input() dialogRef: MatDialogRef<CitySelectionComponent>;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  selectedTowns: any;
  allSelected = false;

  constructor(
    public logService: LogService,
    public formService: FormControlService,
    public appStateService: AppStoreService
  ) {}

  ngOnDestroy() {
    this.logService.debug('ngOnDestroy', this);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.formService.triggerActionOnChange(
      this.controlName,
      this.form,
      this.setTowns,
      this.ngUnsubscribe
    );
  }
  ngOnChanges(simpleChanges: SimpleChanges) {
    this.logService.log(
      'CitySelectionComponent changes',
      simpleChanges,
      this.form,
      this.controlName
    );
    if (this.form && this.controlName) {
      this.setTowns();
    }
  }

  selectAll(select: MatSelect) {
    this.formService.selectAllByValue(
      select,
      this.form,
      this.controlName,
      this.allSelected
    );
    this.allSelected = !this.allSelected;
  }

  setTowns = () => {
    const values: string[] = this.form.controls[this.controlName].value;
    this.selectedTowns = this.formService.buildDescriptionList(
      values,
      this.addressDomains.cities,
      this.valueField,
      'val'
    );
  };

  cancel() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
