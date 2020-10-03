import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Input,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ReferenceItem,
  ReferenceItemAttribute,
  ReferenceValueAttribute,
  ReferenceAttributeType,
  BaseResourceEnum,
  ReferenceDataInfo,
} from '@ocw/shared-models';
import {
  LogService,
  ReferenceDataUtil,
  AppStoreService,
  ResourceStoreService,
  StatusStoreService,
  DomainStoreService,
} from '@ocw/ui-core';
import { BaseAppStateEnum } from '@ocw/shared-models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReferenceDataService } from '../reference-data.service';
import { CloneUtil } from '@ocw/shared-core';
import { FORM_MODE } from '../../forms/enums';
import { ValidatorService } from '../../forms/validator.service';

@Component({
  selector: 'ocw-reference-entity-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card [formGroup]="form">
      <div fxLayout="column">
        <div>
          <mat-form-field style="min-width: 250px;">
            <input
              matInput
              placeholder="Name"
              [formControlName]="ReferenceValueAttribute.val"
              maxlength="30"
              spellcheck="false"
              autocomplete="off"
            />
          </mat-form-field>
        </div>
        <div *ngIf="!referenceDataInfo.hideNameField">
          <mat-form-field style="min-width: 250px;">
            <input
              matInput
              placeholder="Full Name"
              [formControlName]="ReferenceValueAttribute.name"
              maxlength="100"
              spellcheck="false"
              autocomplete="off"
            />
          </mat-form-field>
        </div>
        <div *ngIf="referenceDataInfo">
          <ocw-field-list
            layout="column"
            [form]="form"
            [fields]="referenceDataInfo.customFields"
          ></ocw-field-list>
        </div>
      </div>
      <div *ngIf="referenceDataInfo.allowInactive" fxLayout="row wrap">
        <div fxLayout="row wrap" fxLayoutGap="48px">
          <mat-checkbox [formControlName]="ReferenceItemAttribute.isActive"
            >Is Active</mat-checkbox
          >
        </div>
      </div>
    </mat-card>
    <div>
      <ocw-data-list
        *ngIf="item && item['subMenu']"
        title="Sub-Menu Items"
        [useRoute]="false"
        [data]="item['subMenu']"
        [dataInfo]="childInfo"
        [includeInactive]="true"
        [submitAction]="false"
        [filter]="false"
        (updates)="subListUpdated($event)"
      >
      </ocw-data-list>
    </div>

    <div style="margin-top: 8px;" fxLayout="row">
      <button
        [disabled]="!allowEdit"
        type="button"
        color="primary"
        mat-raised-button
        (click)="save()"
      >
        SAVE
      </button>
      <div style="margin: 4px;"></div>
      <button type="button" color="primary" mat-button (click)="cancel()">
        CANCEL
      </button>
    </div>
  `,
})
export class ReferenceEntityEditComponent implements OnInit, OnDestroy {
  @Input() allowEdit = true;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  titlePrefix: string;
  title: string;
  referenceDataInfo: ReferenceDataInfo;
  childInfo: ReferenceDataInfo;
  form: FormGroup;
  item: ReferenceItem;
  mode: FORM_MODE;
  ReferenceValueAttribute = ReferenceValueAttribute;
  ReferenceItemAttribute = ReferenceItemAttribute;
  ReferenceAttributeType = ReferenceAttributeType;
  ReferenceDataUtil = ReferenceDataUtil;

  constructor(
    private logService: LogService,
    private appStateService: AppStoreService,
    private formBuilder: FormBuilder,
    private resourceService: ResourceStoreService,
    private validatorService: ValidatorService,
    private statusService: StatusStoreService,
    private referenceDataService: ReferenceDataService,
    public domainService: DomainStoreService
  ) {
    this.form = this.createForm();
  }

  ngOnInit() {
    this.resourceService
      .Resource$(BaseResourceEnum.ReferenceEntity)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val: ReferenceItem) => {
        this.populateForm(val);
      });

    this.appStateService
      .AppState$(BaseAppStateEnum.ReferenceDataInfo)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val: ReferenceDataInfo) => {
        this.setReferenceValue(val);
        if (this.item) {
          this.populateForm(this.item);
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createForm() {
    const form = this.formBuilder.group({
      [ReferenceValueAttribute.val]: ['', Validators.required],
      [ReferenceValueAttribute.name]: '',
      [ReferenceItemAttribute.isActive]: '',
      [ReferenceItemAttribute.isDefault]: '',
      [ReferenceItemAttribute.seq]: '',
    });

    return form;
  }

  setReferenceValue(item: ReferenceDataInfo) {
    this.referenceDataInfo = item;
    this.title = item.displayName;
    if (item.customFields) {
      item.customFields.forEach((p) => {
        this.form.addControl(p.attributeName, new FormControl(''));
        this.logService.log('add control', p.attributeType, this.form.controls);
      });
    }
    const clone: ReferenceDataInfo = CloneUtil.cloneDeep(item);
    clone.componentRoute = '';
    clone.domainAttributeName = '';
    this.childInfo = clone;
  }

  populateForm(item: ReferenceItem) {
    this.item = CloneUtil.cloneDeep(item);
    if (this.item.uid) {
      this.titlePrefix = 'Edit ';
      this.mode = FORM_MODE.UPDATE;
    } else {
      this.titlePrefix = 'New ';
      this.mode = FORM_MODE.ADD;
    }
    this.form.reset({}, { emitEvent: false });
    //this.logService.log('form values after reset', this.form.value);
    this.form.patchValue(Object.assign({}, this.item));
    this.logService.log(
      'form values, object value',
      this.form.value,
      this.item
    );
  }

  isValid(): boolean {
    this.validatorService.triggerFormValidation(this.form);
    return this.form.valid;
  }

  save() {
    if (this.isValid()) {
      this.logService.log('Item before update:', this.item);
      let clone = new ReferenceItem();
      clone = Object.assign({}, this.item, this.form.getRawValue());
      const request = this.referenceDataService.createSaveRequest(
        this.mode,
        clone,
        this.referenceDataInfo
      );
      this.resourceService.executeServiceRequest(
        request,
        BaseResourceEnum.ReferenceEntity
      );
    } else {
      this.statusService.publishError('Please fix validation errors');
    }
  }

  subListUpdated = (list: any[]) => {
    console.log('subListUpdated', list);
    this.item['subMenu'] = list;
    this.item = CloneUtil.cloneDeep(this.item);
  };

  cancel() {
    this.appStateService.setState({ opened: false }, BaseAppStateEnum.FormOpen);
  }
}
