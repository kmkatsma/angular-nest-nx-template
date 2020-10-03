import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subject } from 'rxjs';
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
  BaseResourceEnum,
  ReferenceAttributeType,
  BaseAppStateEnum,
  ReferenceDataInfo,
} from '@ocw/shared-models';
import {
  ReferenceDataUtil,
  LogService,
  DomainStoreService,
} from '@ocw/ui-core';
import {
  AppStoreService,
  ResourceStoreService,
  StatusStoreService,
} from '@ocw/ui-core';
import { ReferenceDataService } from '../reference-data.service';
import { takeUntil } from 'rxjs/operators';
import { FORM_MODE } from '../../forms/enums';
import { ValidatorService } from '../../forms/validator.service';

@Component({
  selector: 'ocw-custom-entity-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card [formGroup]="form">
      <mat-card-title> {{ titlePrefix }}{{ title }} </mat-card-title>

      <div *ngIf="referenceDataInfo" fxLayout="row wrap" fxLayoutGap="48px">
        <mat-form-field
          *ngFor="let field of referenceDataInfo.customFields"
          style="min-width: 250px;"
        >
          <input
            *ngIf="field.attributeType === ReferenceAttributeType.String"
            matInput
            [placeholder]="field.placeHolder"
            [formControlName]="field.attributeName"
            maxlength="100"
            spellcheck="false"
            autocomplete="off"
          />

          <input
            *ngIf="field.attributeType === ReferenceAttributeType.Currency"
            type="number"
            matInput
            [placeholder]="field.placeHolder"
            [formControlName]="field.attributeName"
            maxlength="10"
            spellcheck="false"
            autocomplete="off"
          />

          <mat-select
            *ngIf="field.attributeType === ReferenceAttributeType.Domain"
            [placeholder]="field.placeHolder"
            [formControlName]="field.attributeName"
          >
            <mat-option
              *ngFor="
                let item of (domainService.Domain$(field.domainEnum) | async)[
                  field.domainAttributeName
                ]
              "
              matInput
              [value]="item.uid"
              style="padding-bottom: 5px;"
              >{{ item.val }}</mat-option
            >
          </mat-select>
        </mat-form-field>
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
      <button
        [disabled]="!allowEdit"
        type="button"
        color="primary"
        mat-raised-button
        (click)="save()"
      >
        SAVE
      </button>
      <div style="margin: 8px;"></div>
      <button type="button" color="primary" mat-button (click)="cancel()">
        CANCEL
      </button>
    </div>
  `,
})
export class CustomEntityEditComponent implements OnInit, OnDestroy {
  @Input() allowEdit = true;
  @Output() cancelled = new EventEmitter<void>();
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  titlePrefix: string;
  title: string;
  referenceDataInfo: ReferenceDataInfo;
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
      [ReferenceItemAttribute.isActive]: '',
    });
    return form;
  }

  setReferenceValue(item: ReferenceDataInfo) {
    this.referenceDataInfo = item;
    this.title = item.displayName;
    if (item.customFields) {
      item.customFields.forEach((p) => {
        this.form.addControl(p.attributeName, new FormControl(''));
      });
    }
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
    this.form.patchValue(Object.assign({}, this.item));
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

  cancel() {
    this.appStateService.setState({ opened: false }, BaseAppStateEnum.FormOpen);
  }
}
