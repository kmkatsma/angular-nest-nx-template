import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { CloneUtil } from '@ocw/shared-core';
import {
  BaseAppStateEnum,
  ReferenceItemAttribute,
  ReferenceDataInfo,
  AnnualValue,
  AnnualValueField,
} from '@ocw/shared-models';
import {
  AppStoreService,
  IReferenceDataService,
  LogService,
  StatusStoreService,
} from '@ocw/ui-core';
import { Subject } from 'rxjs';
import { FORM_MODE } from '../../forms/enums';
import { ValidatorService } from '../../forms/validator.service';
import { ReferenceDataService } from '../reference-data.service';

@Component({
  selector: 'ocw-reference-year-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card style="margin-top: 8px; margin-left: 1px; margin-right: 1px">
      <div fxLayout="column" [formGroup]="form">
        <ocw-datepicker
          placeHolder="Start Date"
          [formControlName]="AnnualValueField.startDt"
          [required]="false"
          [style]="{ 'min-width.px': 250 }"
          errorMessage="Start Date required"
        ></ocw-datepicker>

        <mat-form-field style="min-width:250px">
          <input
            type="text"
            matInput
            placeholder="Display Year"
            [formControlName]="ReferenceItemAttribute.val"
            maxlength="50"
            spellcheck="false"
            autocomplete="off"
          />
        </mat-form-field>

        <div fxLayout="row wrap" fxLayoutGap="48px">
          <div>
            <mat-checkbox [formControlName]="ReferenceItemAttribute.isActive"
              >Is Active</mat-checkbox
            >
          </div>
        </div>

        <ocw-component-list
          *ngIf="selectedItem && dataEditService"
          [referenceDataInfo]="childListConfig"
          [dataListItem]="dataEditService.referenceItem"
          [createDataListFormCallback]="dataEditService.createDetailForm"
          [dataList]="dataEditService.dataList(selectedItem)"
          [form]="form"
          [formArray]="formArray"
          [showAdd]="true"
          [showRemove]="true"
        ></ocw-component-list>
      </div>
    </mat-card>

    <div style="margin-top: 8px" fxLayout="row">
      <button
        [disabled]="!allowSave"
        type="button"
        color="primary"
        mat-raised-button
        (click)="save()"
      >
        SAVE
      </button>
      <div style="margin-left: 4px"></div>
      <button type="button" color="primary" mat-button (click)="cancel()">
        CANCEL
      </button>
    </div>
  `,
})
export class ReferenceYearEditComponent implements OnDestroy, OnChanges {
  @Input() allowSave = true;
  @Input() dataEditService: IReferenceDataService;
  @Input() selectedItem: AnnualValue;
  @Input() referenceData: ReferenceDataInfo;
  public ngUnsubscribe: Subject<void> = new Subject<void>();

  childListConfig: ReferenceDataInfo;
  form: FormGroup;
  formArray: FormArray;
  AnnualValueField = AnnualValueField;
  mode: FORM_MODE;
  ReferenceItemAttribute = ReferenceItemAttribute;

  constructor(
    private logService: LogService,
    private appStateService: AppStoreService,
    private referenceDataService: ReferenceDataService,
    private validatorService: ValidatorService,
    private statusService: StatusStoreService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataEditService && this.dataEditService) {
      const forms = this.dataEditService.createForms();
      this.form = forms.form;
      this.formArray = forms.formArray;
      this.childListConfig = this.dataEditService.createChildListConfig();
    }
    if (this.selectedItem && this.dataEditService) {
      this.setSelectedItem(this.selectedItem);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setSelectedItem(val: AnnualValue) {
    this.selectedItem = CloneUtil.cloneDeep(val);
    this.logService.log('selectedItem', this.selectedItem);
    if (!val.startDt) {
      this.dataEditService.initializeItem(this.selectedItem);
      this.mode = FORM_MODE.ADD;
    } else {
      this.mode = FORM_MODE.UPDATE;
    }
    this.form.reset({}, { emitEvent: false });
    this.form.patchValue(Object.assign({}, this.selectedItem));
  }

  isValid(): boolean {
    this.validatorService.triggerFormValidation(this.form);
    return this.form.valid;
  }

  save() {
    if (!this.isValid()) {
      this.statusService.publishError('Please fix validation errors');
      return;
    }
    this.referenceDataService.save(
      this.selectedItem,
      this.form,
      this.mode,
      this.referenceData
    );
  }

  cancel() {
    this.appStateService.setState({ opened: false }, BaseAppStateEnum.FormOpen);
  }
}
