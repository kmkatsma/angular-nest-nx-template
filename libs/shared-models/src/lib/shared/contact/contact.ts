import { ReferenceItem } from '../reference-base';
import { IsDefined, MinLength } from 'class-validator';

export enum ContactValueField {
  val = 'val',
  val2 = 'val2',
  notes = 'notes'
}

export enum ContactFormat {
  Phone = 1,
  Email = 2,
  Url = 3
}

export class ContactType extends ReferenceItem {
  @IsDefined()
  @MinLength(1)
  contactFormat: ContactFormat;
  @IsDefined()
  @MinLength(1)
  fieldName: string;
}

export class ContactValue {
  public [ContactValueField.val]: string;
  public [ContactValueField.val2]: string;
  public [ContactValueField.notes]: string;

  constructor(val?: string) {
    this[ContactValueField.val] = val;
  }
}

export enum ContactField {
  home = 'home',
  business = 'business',
  cell = 'cell',
  email = 'email',
  business2 = 'business2',
  fax = 'fax',
  pager = 'pager',
  businessFax = 'businessFax',
  webAddress = 'webAddress',
  vacation = 'vacation',
  nursingHome = 'nursingHome',
  payPhone = 'payPhone',
  emergency1 = 'emergency1',
  emergency2 = 'emergency2',
  emergency3 = 'emergency3',
  emergency4 = 'emergency4',
  tTy = 'tTy',
  napisContact1 = 'napisContact1',
  napisContact2 = 'napisContact2'
}

export class ContactFieldValues {
  public [ContactField.home]: string;
  public [ContactField.cell]: string;
  public [ContactField.email]: string;
  public [ContactField.business]: string;
  public [ContactField.business2]: string;
  public [ContactField.fax]: string;
  public [ContactField.pager]: string;
  public [ContactField.businessFax]: string;
  public [ContactField.webAddress]: string;
  public [ContactField.vacation]: string;
  public [ContactField.nursingHome]: string;
  public [ContactField.payPhone]: string;
  public [ContactField.emergency1]: string;
  public [ContactField.emergency2]: string;
  public [ContactField.emergency3]: string;
  public [ContactField.emergency4]: string;
  public [ContactField.tTy]: string;
  public [ContactField.napisContact1]: string;
  public [ContactField.napisContact2]: string;
}

export class PhoneNumberInfo {
  number: string;
  type: string;
}
