import { StringUtil } from '@ocw/shared-core';
import * as R from 'rambda';
import { ContactField, ContactFieldValues, PhoneNumberInfo } from './contact';
import { ContactTypeDescription } from './contact-config';

export class ContactFieldsReader {
  private doc: ContactFieldValues;

  constructor(fields: ContactFieldValues) {
    this.doc = fields;
  }

  homePhone() {
    return StringUtil.undefinedToEmpty(R.path([ContactField.home], this.doc));
  }

  cellPhone() {
    return StringUtil.undefinedToEmpty(R.path([ContactField.cell], this.doc));
  }

  businessPhone() {
    return StringUtil.undefinedToEmpty(
      R.path([ContactField.business], this.doc)
    );
  }

  emailAddress() {
    return StringUtil.undefinedToEmpty(R.path([ContactField.email], this.doc));
  }

  getPrimaryPhoneNumbers() {
    const phoneNumberList = new Array<PhoneNumberInfo>();

    const cell = this.cellPhone();
    if (cell) {
      phoneNumberList.push({ number: cell, type: ContactTypeDescription.Cell });
    }
    const home = this.homePhone();
    if (home) {
      phoneNumberList.push({ number: home, type: ContactTypeDescription.Home });
    }
    const business = this.businessPhone();
    if (business) {
      phoneNumberList.push({
        number: business,
        type: ContactTypeDescription.Business
      });
    }
    return phoneNumberList;
  }

  getPrimaryPhoneNumber() {
    const phones = this.getPrimaryPhoneNumbers();
    if (phones.length > 0) {
      return StringUtil.formatPhone(phones[0].number);
    } else {
      return '';
    }
  }
}
