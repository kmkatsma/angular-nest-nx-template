import {
  Component,
  OnInit,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  ReferenceDataUtil,
  LogService,
  ResourceStoreService,
  StatusStoreService,
  DomainStoreService,
  FormEvent,
  FormEventType,
} from '@ocw/ui-core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  ReferenceItem,
  ReferenceValueAttribute,
  ReferenceItemAttribute,
  ReferenceAttributeType,
  ReferenceDataInfo,
} from '@ocw/shared-models';
import { CloneUtil } from '@ocw/shared-core';
import { ReferenceDataService } from '../../reference-data/reference-data.service';
import { FORM_MODE } from '../../forms/enums';
import { ValidatorService } from '../../forms/validator.service';

@Component({
  selector: 'ocw-data-edit',
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
          <ng-container *ngFor="let field of referenceDataInfo.customFields">
            <mat-form-field
              *ngIf="field.attributeType === ReferenceAttributeType.String"
              style="min-width: 250px;"
            >
              <input
                matInput
                [placeholder]="field.placeHolder"
                [formControlName]="field.attributeName"
                maxlength="100"
                spellcheck="false"
                autocomplete="off"
              />
            </mat-form-field>
            <mat-form-field
              style="min-width: 250px;"
              *ngIf="field.attributeType === ReferenceAttributeType.Currency"
            >
              <input
                type="number"
                matInput
                [placeholder]="field.placeHolder"
                [formControlName]="field.attributeName"
                maxlength="10"
                spellcheck="false"
                autocomplete="off"
              />
            </mat-form-field>
            <mat-form-field
              style="min-width: 250px;"
              *ngIf="field.attributeType === ReferenceAttributeType.Domain"
            >
              <mat-select
                [placeholder]="field.placeHolder"
                [formControlName]="field.attributeName"
              >
                <mat-option
                  *ngFor="
                    let item of (domainService.Domain$(field.domainEnum)
                      | async)[field.domainAttributeName]
                  "
                  matInput
                  [value]="item.uid"
                  style="padding-bottom: 5px;"
                  >{{ item.val }}</mat-option
                >
              </mat-select>
            </mat-form-field>

            <ocw-multi-select
              *ngIf="field.attributeType === ReferenceAttributeType.MultiSelect"
              [form]="form"
              [controlName]="field.attributeName"
              [listData]="
                (domainService.Domain$(field.domainEnum) | async)[
                  field.domainAttributeName
                ]
              "
              [placeHolder]="field.placeHolder"
            ></ocw-multi-select>
          </ng-container>
        </div>
      </div>
      <div fxLayout="row wrap">
        <div fxLayout="row wrap" fxLayoutGap="48px">
          <mat-checkbox [formControlName]="ReferenceItemAttribute.isActive"
            >Is Active</mat-checkbox
          >
        </div>
      </div>
    </mat-card>

    <div style="margin-top: 8px;" fxLayout="row">
      <button type="button" color="primary" mat-raised-button (click)="save()">
        {{ submitActionText }}
      </button>
      <div style="margin: 4px;"></div>
      <button type="button" color="primary" mat-button (click)="cancel()">
        CANCEL
      </button>
    </div>
  `,
})
export class DataEditComponent implements OnInit, OnChanges, OnDestroy {
  @Input() titlePrefix: string;
  @Input() title: string;
  @Input() referenceDataInfo: ReferenceDataInfo;
  @Input() item: ReferenceItem;
  @Input() submitAction = true;
  @Output() action = new EventEmitter<FormEvent<any>>();

  form: FormGroup;
  submitActionText = 'SAVE';
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  mode: FORM_MODE;
  ReferenceValueAttribute = ReferenceValueAttribute;
  ReferenceItemAttribute = ReferenceItemAttribute;
  ReferenceAttributeType = ReferenceAttributeType;
  ReferenceDataUtil = ReferenceDataUtil;

  constructor(
    private logService: LogService,
    private formBuilder: FormBuilder,
    private resourceService: ResourceStoreService,
    private validatorService: ValidatorService,
    private statusService: StatusStoreService,
    private referenceDataService: ReferenceDataService,
    public domainService: DomainStoreService
  ) {
    this.form = this.createForm();
  }

  ngOnInit() {}

  ngOnChanges(simplechanges: SimpleChanges) {
    if (simplechanges.form || simplechanges.referenceDataInfo) {
      if (this.form && this.referenceDataInfo) {
        this.setReferenceValue(this.referenceDataInfo);
      }
    }
    if (
      simplechanges.item ||
      simplechanges.referenceDataInfo ||
      simplechanges.form
    ) {
      if (this.item && this.referenceDataInfo && this.form) {
        this.populateForm(this.item);
      }
    }
    if (simplechanges.submitAction) {
      if (this.submitAction === false) {
        this.submitActionText = 'OK';
      }
    }
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
  }

  populateForm(item: ReferenceItem) {
    this.item = item;
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
    if (!this.isValid()) {
      this.logService.log('form', this.form);
      this.statusService.publishError('Please fix validation errors');
      return;
    }
    let clone = new ReferenceItem();
    clone = Object.assign({}, this.item, this.form.getRawValue());
    if (!this.submitAction) {
      this.action.emit(new FormEvent(clone, null, FormEventType.Save));
    } else {
      if (!this.referenceDataInfo.resourceEnum) {
        this.statusService.publishError('Missing Resource Enum');
        return;
      }
      const request = this.referenceDataService.createSaveRequest(
        this.mode,
        clone,
        this.referenceDataInfo
      );
      this.resourceService.executeServiceRequest(
        request,
        this.referenceDataInfo.resourceEnum
      );
    }
  }

  cancel() {
    this.action.emit(new FormEvent(undefined, null, FormEventType.Cancel));
  }
}
