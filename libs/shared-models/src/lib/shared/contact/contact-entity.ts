import { ContactFieldValues } from './contact';
import { ReferenceItem } from '../reference-base';

export enum OtherContactType {
  Person = 1,
  Agency = 2
}

export enum ContactEntityType {
  Contact = 1,
  Referrer = 2,
  Doctor = 3,
  Self = 4
}

export enum ContactEntityField {
  firstName = 'firstName',
  lastName = 'lastName',
  type = 'type',
  relationship = 'relationship',
  additionalInfo = 'additionalInfo',
  contacts = 'contacts',
  notes = 'notes',
  isPrimary = 'isPrimary',
  reason = 'reason',
  constituentLink = 'constituentLink',
  agencyId = 'agencyId'
}

export class ContactEntityFields {
  public [ContactEntityField.constituentLink]: string;
  public [ContactEntityField.agencyId]: string;
  public [ContactEntityField.firstName]: string;
  public [ContactEntityField.lastName]: string;
  public [ContactEntityField.type]: OtherContactType;
  public [ContactEntityField.relationship]: ReferenceItem;
  public [ContactEntityField.contacts]: ContactFieldValues;
  public [ContactEntityField.notes]: ContactFieldValues;
  public [ContactEntityField.additionalInfo]: string;
  public [ContactEntityField.isPrimary]: boolean;
  public [ContactEntityField.reason]: string;
}

export enum OtherContactField {
  contact1 = 'contact1',
  contact2 = 'contact2',
  referrer = 'referrer',
  preferredContact = 'preferredContact'
}

export class OtherContacts {
  [OtherContactField.contact1]: ContactEntityFields = new ContactEntityFields();
  [OtherContactField.contact2]: ContactEntityFields = new ContactEntityFields();
  [OtherContactField.referrer]: ContactEntityFields = new ContactEntityFields();
  [OtherContactField.preferredContact]: number;
}
