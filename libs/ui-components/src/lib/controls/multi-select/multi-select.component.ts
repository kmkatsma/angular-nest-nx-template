import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  Input,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReferenceItemAttribute, ReferenceItem } from '@ocw/shared-models';
import { Subject } from 'rxjs';
import { LogService } from '@ocw/ui-core';
import { MatSelect } from '@angular/material/select';
import * as R from 'rambda';
import { FormControlService } from '../../forms/form-control.service';

@Component({
  selector: 'ocw-multi-select',
  template: `
    <div fxLayout="row" [formGroup]="form" *ngIf="listData">
      <mat-form-field style="min-width: 300px;" fxFlex>
        <mat-select
          [placeholder]="placeHolder"
          [formControlName]="controlName"
          multiple
          #serviceTypesSelect
        >
          <mat-select-trigger>
            <span>{{ selectedItems }}</span>
          </mat-select-trigger>
          <mat-option *ngFor="let service of listData" [value]="service.uid">{{
            service[displayField]
          }}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-checkbox
        *ngIf="showSelectAll && selectAllControlName"
        type="checkbox"
        id="selectAllServiceTypes"
        [formControlName]="selectAllControlName"
        [value]="allSelected"
        (click)="selectAll(serviceTypesSelect)"
        style="min-width: 113px;margin-left:16px; padding-top:10px"
        >Select All</mat-checkbox
      >
      <mat-checkbox
        *ngIf="showSelectAll && !selectAllControlName"
        type="checkbox"
        id="selectAllServiceTypes"
        [value]="allSelected"
        (click)="selectAll(serviceTypesSelect)"
        style="min-width: 113px;margin-left:16px; padding-top:10px"
        >Select All</mat-checkbox
      >
    </div>
  `,
})
export class MultiSelectComponent implements OnInit, OnDestroy, OnChanges {
  @Input() form: FormGroup;
  @Input() controlName: string;
  @Input() selectAllControlName: string;
  @Input() listData: ReferenceItem[];
  @Input() showSelectAll = false;
  @Input() placeHolder: string;
  @Input() displayField = 'name';

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  selectedItems: string;
  allSelected = false;

  constructor(
    public logService: LogService,
    public formService: FormControlService
  ) {}

  ngOnDestroy() {
    this.logService.debug('ngOnDestroy', this);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.logService.log('MultiSelect init', this.form, this.controlName);
    this.formService.triggerActionOnChange(
      this.controlName,
      this.form,
      this.setDescriptionValues,
      this.ngUnsubscribe
    );
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (this.form && this.controlName) {
      this.setDescriptionValues();
    }
    if (simpleChanges['listData'] && this.listData) {
      this.listData = R.sortBy(R.path([ReferenceItemAttribute.val]))(
        this.listData
      );
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

  setDescriptionValues = () => {
    const values: string[] = this.form.controls[this.controlName].value;
    this.selectedItems = this.formService.buildDescriptionList(
      values,
      this.listData,
      ReferenceItemAttribute.uid,
      ReferenceItemAttribute.val
    );
  };
}
