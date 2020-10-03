import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TenantService } from './tenant.service';
import { StatusStoreService, AuthService } from '@ocw/ui-core';
import {
  TenantDocument,
  TenantAttribute,
  ReferenceItem,
} from '@ocw/shared-models';
import { ValidatorService } from '@ocw/ui-components';
import { CloneUtil } from '@ocw/shared-core';

export const tenantFeatures: ReferenceItem[] = [];

@Component({
  selector: 'ocw-tenant-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card style="margin:8px">
      <ocw-card-title
        titleText="Tenant Entry"
        iconName="payments"
        subTitleText="Add/Edit Tenant Configuration"
      ></ocw-card-title>

      <div [formGroup]="form" fxLayout="column">
        <mat-form-field style="min-width: 300px;">
          <input
            type="text"
            matInput
            placeholder="Tenant Name"
            [formControlName]="TenantAttribute.tenantName"
          />
        </mat-form-field>
        <mat-form-field style="min-width: 300px;">
          <input
            type="text"
            matInput
            placeholder="Domain Name"
            [formControlName]="TenantAttribute.domainName"
          />
        </mat-form-field>
        <ocw-multi-select
          *ngIf="form"
          placeHolder="Features"
          [listData]="tenantFeatures"
          [form]="form"
          [controlName]="TenantAttribute.features"
          [style]="{ 'min-width.px': 250 }"
        >
        </ocw-multi-select>
        <ocw-select
          *ngIf="states"
          [style]="{ 'min-width.px': 250 }"
          [controlName]="TenantAttribute.tenantState"
          [formGroup]="form"
          [listData]="states"
          placeHolder="Tenant State"
          valueProperty="val"
        ></ocw-select>

        <mat-checkbox [formControlName]="TenantAttribute.isDeleted"
          >Inactive</mat-checkbox
        >
      </div>
    </mat-card>
    <div style="margin-top: 10px; margin-left: 8px;">
      <button type="button" color="primary" mat-raised-button (click)="save()">
        OK
      </button>
      <button type="button" color="primary" mat-button (click)="cancel()">
        CANCEL
      </button>
    </div>
    <div style="margin-top: 8px"></div>
    <mat-card *ngIf="tenantRecord.id">
      <mat-card-title>Users</mat-card-title>
    </mat-card>
  `,
})
export class TenantEditComponent implements OnInit, OnChanges {
  @Input() tenantRecord: TenantDocument;
  @Output() cancelled = new EventEmitter<void>();
  form: FormGroup;
  tenantFeatures = tenantFeatures;
  TenantAttribute = TenantAttribute;
  states: ReferenceItem[];

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    public statusStoreService: StatusStoreService,
    public tenantService: TenantService,
    private validatorService: ValidatorService
  ) {
    this.createForm();
    this.states = this.tenantService.populateStates();
  }

  ngOnInit() {
    console.log('user state', this.authService.currentUser);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tenantRecord && this.tenantRecord) {
      this.populateForm();
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      [TenantAttribute.domainName]: ['', Validators.required],
      [TenantAttribute.tenantName]: ['', Validators.required],
      [TenantAttribute.tenantState]: ['', Validators.required],
      [TenantAttribute.features]: [''],
      [TenantAttribute.isDeleted]: [''],
    });
  }

  populateForm() {
    const patchObject: TenantDocument = Object.assign({}, this.tenantRecord);
    this.form.patchValue(Object.assign({}, patchObject));
    console.log('form value', this.form);
  }

  isValid(): boolean {
    this.validatorService.triggerFormValidation(this.form);
    return this.form.valid;
  }

  save() {
    if (!this.isValid()) {
      this.validatorService.publishError('Please fix validation errors');
      return;
    }
    const formModel = this.form.value;
    const clone = CloneUtil.cloneDeep(this.tenantRecord);
    const docToSave: TenantDocument = Object.assign({}, clone, formModel);

    this.tenantService.save(docToSave);
  }

  cancel() {
    this.cancelled.emit();
  }
}
