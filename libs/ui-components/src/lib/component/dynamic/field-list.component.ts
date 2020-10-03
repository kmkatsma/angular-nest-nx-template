import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  ReferenceEntityField,
  ReferenceAttributeType,
} from '@ocw/shared-models';
import { DomainStoreService, LogService } from '@ocw/ui-core';

@Component({
  selector: 'ocw-field-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="form" [formGroup]="form">
      <div [fxLayout]="layout">
        <ng-container *ngIf="fields">
          <ng-container *ngFor="let field of fields">
            <ng-container
              *ngIf="field.attributeType === ReferenceAttributeType.String"
            >
              <ocw-text-field [field]="field" [form]="form"></ocw-text-field>
            </ng-container>
            <mat-form-field
              *ngIf="field.attributeType === ReferenceAttributeType.Currency"
              [style]="{ 'min-width.px': fieldWidth }"
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
            <ng-container
              *ngIf="field.attributeType === ReferenceAttributeType.SystemDate"
            >
              <ocw-datepicker
                [placeHolder]="field.placeHolder"
                [formControlName]="field.attributeName"
                [required]="true"
                [style]="{ 'min-width.px': fieldWidth }"
                errorMessage="Date is Required"
              ></ocw-datepicker>
            </ng-container>
            <ng-container
              *ngIf="field.attributeType === ReferenceAttributeType.Domain"
            >
              <ocw-select-field
                [form]="form"
                [style]="{ 'min-width.px': fieldWidth }"
                [field]="field"
                [referenceData]="
                  domainService.Domain$(field.domainEnum) | async
                "
              ></ocw-select-field>
            </ng-container>
            <ng-container
              *ngIf="
                field.attributeType === ReferenceAttributeType.EnumAllowedValues
              "
            >
              <ocw-select
                [placeHolder]="field.placeHolder"
                [listData]="field.allowedValues"
                [style]="{ 'min-width.px': fieldWidth }"
                [formGroup]="form"
                [controlName]="field.attributeName"
                valueProperty="val"
              ></ocw-select>
            </ng-container>
            <ng-container
              *ngIf="field.attributeType === ReferenceAttributeType.Notes"
            >
              <ocw-note-input
                [placeholder]="field.placeHolder"
                [required]="false"
                [formGroup]="form"
                [controlName]="field.attributeName"
                [style]="{ 'min-width.px': 250 }"
              ></ocw-note-input>
            </ng-container>
            <ng-container
              *ngIf="field.attributeType === ReferenceAttributeType.Boolean"
            >
              <mat-checkbox [formControlName]="field.attributeName"
                >Is Intake Location</mat-checkbox
              >
            </ng-container>
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
        </ng-container>
        <div *ngIf="showRemove">
          <button mat-raised-button (click)="removeItem()">REMOVE</button>
        </div>
      </div>
    </div>
  `,
})
export class FieldListComponent implements OnChanges {
  @Input() showRemove = false;
  @Input() form: FormGroup;
  @Input() fields: ReferenceEntityField[];
  @Input() layoutGap = '32px';
  @Input() layout = 'row wrap';
  @Input() fieldWidth = 250;
  @Input() updateForm = true;
  @Output() fieldsRendered: EventEmitter<void> = new EventEmitter();
  @Output() removeItemClicked: EventEmitter<void> = new EventEmitter();

  ReferenceAttributeType = ReferenceAttributeType;

  constructor(
    public domainService: DomainStoreService,
    private logService: LogService
  ) {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.fields || simpleChanges.form) {
      this.addFormFields();
    }
    this.logService.log('Field List Component inputs', this.fields, this.form);
  }

  addFormFields() {
    if (!this.fields || !this.form || !this.updateForm) {
      return;
    }
    this.fields.forEach((p) => {
      if (!this.form.controls[p.attributeName]) {
        console.log('adding control', p.attributeName, this.form.controls);
        this.form.addControl(p.attributeName, new FormControl(''));
        if (p.required) {
          this.form.controls[p.attributeName].setValidators(
            Validators.required
          );
        }
      }
    });
    this.fieldsRendered.emit();
  }

  removeItem() {
    this.removeItemClicked.emit();
  }
}
