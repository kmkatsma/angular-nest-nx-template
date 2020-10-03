import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  AddressAttribute,
  AddressReferenceData,
  ContactField,
  PartnerField,
  ContactFieldValues,
  PersonReferenceData,
} from '@ocw/shared-models';
import { LogService } from '@ocw/ui-core';
import { FormEvent } from '@ocw/ui-core';
import { FormControlService } from '../../../forms/form-control.service';

@Component({
  selector: 'ocw-partner-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card *ngIf="partnerForm" [formGroup]="partnerForm">
      <mat-card-title>{{ title }}</mat-card-title>

      <div fxLayout="row wrap" fxLayoutGap="50px">
        <div>
          <mat-form-field style="min-width:204px">
            <input
              matInput
              placeholder="Name"
              [formControlName]="PartnerField.name"
              maxlength="50"
              spellcheck="false"
              autocomplete="off"
              #lastName
            />
            <mat-hint align="end" aria-live="polite"
              >{{ lastName.value.length }} / 50</mat-hint
            >
          </mat-form-field>
        </div>
      </div>
      <ocw-address
        [wrapInCard]="false"
        [addressReferenceData]="addressDomains"
        [addressForm]="addressForm"
        [fieldsToHide]="AddressAttributesToHide"
      ></ocw-address>
      <ocw-contacts
        *ngIf="contactFields"
        [contactNotesForm]="contactNotesForm"
        [contactsForm]="contactsForm"
        [contactFields]="contactFields"
        [domains]="domains"
        [wrapInCard]="false"
        [defaultContactTypes]="defaultContactTypes"
        [fieldStyle]="{ 'min-width.px': 250 }"
        [showAddContact]="false"
      ></ocw-contacts>
    </mat-card>
  `,
})
export class PartnerEditComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() contactFields: ContactFieldValues;
  @Input() domains: PersonReferenceData;
  @Input() addressDomains: AddressReferenceData;
  @Input() partnerForm: FormGroup;
  @Output() formEvent: EventEmitter<FormEvent<any>> = new EventEmitter();

  contactsForm: FormGroup;
  contactNotesForm: FormGroup;
  addressForm: FormGroup;
  PartnerField = PartnerField;
  defaultContactTypes = new Array<string>();
  AddressAttributesToHide = [AddressAttribute.township];

  constructor(
    private formControlService: FormControlService,
    private logService: LogService
  ) {
    this.defaultContactTypes.push(ContactField.business);
    this.defaultContactTypes.push(ContactField.business2);
    this.defaultContactTypes.push(ContactField.email);
  }

  ngOnInit() {}

  ngOnChanges() {
    if (this.partnerForm) {
      this.logService.log('partnerForm', this.partnerForm);
      this.contactsForm = this.formControlService.getFormGroup(
        this.partnerForm,
        PartnerField.contacts
      );
      this.contactNotesForm = this.formControlService.getFormGroup(
        this.partnerForm,
        PartnerField.contactsNotes
      );
      this.addressForm = this.formControlService.getFormGroup(
        this.partnerForm,
        PartnerField.address
      );
    }
  }
}
