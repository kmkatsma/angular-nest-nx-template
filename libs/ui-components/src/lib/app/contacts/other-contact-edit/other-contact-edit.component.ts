import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  PersonReferenceData,
  ContactEntityField,
  ContactEntityType,
  ContactFieldValues,
  OtherContactType,
  PartnerDocumentReferenceData,
  PartnerDocument,
} from '@ocw/shared-models';
import { FormEvent } from '@ocw/ui-core';
import { FormControlService } from '../../../forms/form-control.service';

@Component({
  selector: 'ocw-other-contact-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card *ngIf="contactEntityForm" [formGroup]="contactEntityForm">
      <mat-card-title>{{ title }}</mat-card-title>
      <div fxLayout="column">
        <div *ngIf="contactEntityType === ContactEntityType.Referrer">
          <ocw-select
            *ngIf="domains"
            [style]="{ 'min-width.px': 250 }"
            [controlName]="ContactEntityField.type"
            [formGroup]="contactEntityForm"
            [listData]="domains.otherContactTypes"
            placeHolder="Referrer Type"
          ></ocw-select>
        </div>
        <div fxLayout="row wrap" fxLayoutGap="50px">
          <div>
            <mat-form-field [ngStyle]="fieldStyle">
              <input
                matInput
                placeholder="Last Name"
                [formControlName]="ContactEntityField.lastName"
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
          <div>
            <mat-form-field [ngStyle]="fieldStyle">
              <input
                matInput
                placeholder="First Name"
                [formControlName]="ContactEntityField.firstName"
                maxlength="50"
                spellcheck="false"
                autocomplete="off"
                #firstName
              />
              <mat-hint align="end" aria-live="polite"
                >{{ firstName.value.length }} / 50</mat-hint
              >
            </mat-form-field>
          </div>
          <div *ngIf="showRelationship">
            <ocw-autocomplete
              *ngIf="domains"
              [style]="fieldStyle"
              placeHolder="Relationship"
              [listData]="domains.relationshipTypes"
              [controlName]="ContactEntityField.relationship"
              [formGroup]="contactEntityForm"
              [required]="false"
            ></ocw-autocomplete>
          </div>
          <div *ngIf="showPartners">
            <ocw-autocomplete-id
              *ngIf="showPartners"
              [style]="{ 'min-width.px': 250 }"
              placeHolder="Agency"
              [listData]="partnerList"
              [formGroup]="contactEntityForm"
              [controlName]="ContactEntityField.agencyId"
              valueField="id"
            ></ocw-autocomplete-id>
          </div>
          <div>
            <mat-form-field [ngStyle]="fieldStyle">
              <input
                matInput
                [placeholder]="additionalInfoPlaceholder"
                [formControlName]="ContactEntityField.additionalInfo"
                maxlength="50"
                spellcheck="false"
                autocomplete="off"
              />
            </mat-form-field>
          </div>
        </div>
        <div>
          <ocw-contacts
            *ngIf="contactFields"
            [style]="fieldStyle"
            [contactNotesForm]="contactNotesForm"
            [contactsForm]="contactsForm"
            [contactFields]="contactFields"
            [domains]="domains"
            [wrapInCard]="false"
            [defaultContactTypes]="defaultContactTypes"
            [showAddContact]="showAddContacts"
          ></ocw-contacts>
        </div>
        <div>
          <mat-checkbox [formControlName]="ContactEntityField.isPrimary"
            >Is Primary Contact</mat-checkbox
          >
        </div>
      </div>
    </mat-card>
  `,
})
export class OtherContactEditComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() contactEntityType: ContactEntityType;
  @Input() contactFields: ContactFieldValues;
  @Input() domains: PersonReferenceData;
  @Input() partners: PartnerDocumentReferenceData;
  @Input() contactEntityForm: FormGroup;
  @Input() showRelationship = true;
  @Input() defaultContactTypes: string[];
  @Input() showAddContacts = true;
  @Input() fieldStyle = {};
  @Output() formEvent: EventEmitter<FormEvent<any>> = new EventEmitter();

  ContactEntityField = ContactEntityField;
  ContactEntityType = ContactEntityType;
  contactsForm: FormGroup;
  contactNotesForm: FormGroup;
  showPartners = false;
  partnerList: PartnerDocument[];
  additionalInfoPlaceholder = 'Additional Info';

  constructor(private formControlService: FormControlService) {}

  ngOnInit() {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (
      simpleChanges.contactEntityType &&
      this.contactEntityType &&
      this.contactEntityType === ContactEntityType.Referrer
    ) {
      this.additionalInfoPlaceholder = 'Referral Reason';
    }
    if (
      simpleChanges.contactEntityForm &&
      simpleChanges.contactEntityForm.currentValue
    ) {
      this.contactEntityForm
        .get('type')
        .valueChanges.pipe()
        .subscribe((val: OtherContactType) => {
          this.updateFormStatus(val);
        });
      this.updateFormStatus(this.contactEntityForm.controls['type'].value);
    }

    if (
      simpleChanges.contactEntityForm &&
      simpleChanges.contactEntityForm.currentValue
    ) {
      this.contactsForm = this.formControlService.getFormGroup(
        this.contactEntityForm,
        ContactEntityField.contacts
      );
      this.contactNotesForm = this.formControlService.getFormGroup(
        this.contactEntityForm,
        ContactEntityField.notes
      );
    }

    if (this.partners && simpleChanges.partners) {
      this.partnerList = this.partners.Partner;
    }
  }

  private updateFormStatus(val: OtherContactType) {
    if (val === OtherContactType.Agency) {
      this.showPartners = true;
      this.showRelationship = false;
    }
    if (val === OtherContactType.Person) {
      this.showPartners = false;
      this.showRelationship = true;
    }
  }
}
