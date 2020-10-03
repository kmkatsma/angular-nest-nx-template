import { Injectable } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  ContactType,
  PersonReferenceData,
  ContactField,
  ContactEntityField,
  PartnerField,
  ContactFieldValues,
} from '@ocw/shared-models';
import { LogService } from '@ocw/ui-core';
import { AddressFormService } from '../address/address-form.service';
import { EMAIL_REGEX, PHONE_REGEX } from '../../forms/validator.service';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  public contactTypes: Array<ContactType>;
  public selectedContactTypes: Array<number>;

  constructor(
    private logService: LogService,
    private formBuilder: FormBuilder,
    private addressFormService: AddressFormService
  ) {}

  public createContactEntityForm(
    contactsGroup?: FormGroup,
    contactNotesFormGroup?: FormGroup
  ) {
    if (!contactsGroup) {
      const { contactsForm, contactsNotesForm } = this.createContactsForms();
      contactsGroup = contactsForm;
      contactNotesFormGroup = contactsNotesForm;
    }

    return this.formBuilder.group({
      [ContactEntityField.additionalInfo]: '',
      [ContactEntityField.agencyId]: '',
      [ContactEntityField.constituentLink]: '',
      [ContactEntityField.contacts]: contactsGroup,
      [ContactEntityField.notes]: contactNotesFormGroup,
      [ContactEntityField.firstName]: '',
      [ContactEntityField.isPrimary]: '',
      [ContactEntityField.lastName]: '',
      [ContactEntityField.reason]: '',
      [ContactEntityField.relationship]: '',
      [ContactEntityField.type]: '',
    });
  }

  public createPartnerForm(
    contactsGroup: FormGroup,
    contactNotesFormGroup: FormGroup
  ) {
    //return this.formBuilder.group({ name: '' });
    return this.formBuilder.group({
      [PartnerField.name]: '',
      [PartnerField.address]: this.addressFormService.createAddressForm(),
      [PartnerField.partnerType]: '',
      [PartnerField.contacts]: contactsGroup,
      [PartnerField.contactsNotes]: contactNotesFormGroup,
      //TODO: rates
    });
  }

  createContactsForms() {
    const contactsForm = this.formBuilder.group({});
    const contactsNotesForm = this.formBuilder.group({});
    Object.keys(ContactField).forEach((element) => {
      contactsNotesForm.addControl(element, new FormControl(''));
      if (element === ContactField.email) {
        contactsForm.addControl(
          element,
          new FormControl('', Validators.pattern(EMAIL_REGEX))
        );
        return;
      }
      if (element === ContactField.webAddress) {
        contactsForm.addControl(element, new FormControl(''));
        return;
      }
      contactsForm.addControl(
        element,
        new FormControl('', Validators.pattern(PHONE_REGEX))
      );
    });
    return { contactsForm: contactsForm, contactsNotesForm: contactsNotesForm };
  }

  populateLocalContacts(
    contactsForm: FormGroup,
    domains: PersonReferenceData,
    contactFields: ContactFieldValues,
    defaultsContactTypes?: string[]
  ) {
    //this.logService.log('contactsForm', contactsForm.controls);
    this.logService.log(
      'defaultsContactTypes',
      defaultsContactTypes,
      domains.contactTypes
    );
    this.contactTypes = Object.assign([], domains.contactTypes);
    let contacts: ContactType[] = [];
    let defaults: ContactType[] = [];
    if (domains.contactTypes) {
      if (defaultsContactTypes) {
        defaultsContactTypes.forEach((ct) => {
          const match = domains.contactTypes.find((p) => p.fieldName === ct);
          if (match) {
            console.log('match, default', match, defaults);
            defaults.push(match);
          }
          console.log('defaults', defaults, ct);
        });
      } else {
        defaults = domains.contactTypes.filter((p) => p.isDefault === true);
      }
    }
    contacts = defaults;
    this.logService.log('populateLocalContacts', contacts, defaults);
    //this.logService.log('contact keys', Object.keys(contactFields));
    const keys = Object.keys(contactFields);
    if (!keys) {
      return;
    }
    Object.keys(contactFields).forEach((contactFieldName) => {
      //this.logService.log('contactFieldName', contactFieldName);
      let contactType = domains.contactTypes.find(
        (p) => p.fieldName === contactFieldName
      );
      if (
        contactType &&
        !contactType.isDefault &&
        contactFields[contactFieldName] &&
        contactFields[contactFieldName]
      ) {
        const exists = contacts.find((p) => p.fieldName === contactFieldName);
        if (!exists && contactType) {
          contacts.push(contactType);
        }
      }
      if (
        contactsForm.controls[contactFieldName] &&
        contactsForm.controls[contactFieldName].value
      ) {
        contactType = domains.contactTypes.find(
          (p) => p.fieldName === contactFieldName
        );
        const exists = contacts.find((p) => p.fieldName === contactFieldName);
        if (!exists && contactType) {
          contacts.push(contactType);
        }
      }
    });
    contacts = contacts.sort(function (obj1: ContactType, obj2: ContactType) {
      return obj1.seq - obj2.seq;
    });
    this.logService.log('contacts populated', contacts);
    return contacts;
  }
}
