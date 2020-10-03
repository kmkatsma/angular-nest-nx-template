import { ContactFieldValues } from '../contact/contact';
import { Address } from '../address/address';
import { ContactEntityFields } from '../contact/contact-entity';
import { ReferenceItem, ReferenceItemAttribute } from '../reference-base';
import { ValidateNested, IsDefined, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDocument } from '../../base-models';
import { RequestAction } from '../request-response/request-action';
import {
  EntityRequest,
  ServiceRequest,
} from '../request-response/service-response';
import { BaseDomainKeyEnum } from '../configuration/domains';

export class PartnerSearchRequest extends BaseDocument {
  partnerType: number;
}

export class PartnerYearSearchRequest extends BaseDocument {
  idNotEqual: string;
  partnerId: string;
  fiscalYear: number;
  startDt: number;
  startDtBefore: number;
}

export enum PartnerServiceType {
  ManagedCare = 1,
  ContinuingCare = 2,
}

export class ServiceLocationCode {
  code: string;
  locationId?: number;
}

export class PartnerService {
  serviceType: PartnerServiceType;
  locationCodes: ServiceLocationCode[];
}

export enum PartnerField {
  name = 'name',
  address = 'address',
  partnerType = 'partnerType',
  contacts = 'contacts',
  contactPerson = 'contactPerson',
  contactsNotes = 'notes',
  services = 'services',
}

export class PartnerEntity extends EntityRequest {
  partnerDoc: PartnerDocument;
}

export class PartnerDocument extends ReferenceItem {
  @IsDefined()
  [PartnerField.name]: string;
  @IsDefined()
  [PartnerField.address]: Address;
  @IsDefined()
  [PartnerField.partnerType]: number;
  @IsDefined()
  [PartnerField.contacts]: ContactFieldValues = new ContactFieldValues();
  [PartnerField.contactsNotes]: ContactFieldValues;
  @IsDefined()
  [PartnerField.contactPerson]: ContactEntityFields = new ContactEntityFields();
  [PartnerField.services]: PartnerService[] = [];
  [ReferenceItemAttribute.referenceGroup] = BaseDomainKeyEnum.Partner;
  [ReferenceItemAttribute.referenceType] = BaseDomainKeyEnum.Partner;
}

export class PartnerDocumentReferenceData {
  [BaseDomainKeyEnum.Partner]: PartnerDocument[] = [];
}

export class PartnerLink extends ReferenceItem {
  public id: string;
  public name: string;
}

export class SavePartnerRequest extends ServiceRequest<SavePartnerRequest> {
  @ValidateNested()
  @Type(() => PartnerDocument)
  @IsDefined()
  partner: PartnerDocument = new PartnerDocument();
  @IsIn([1, 2, 3])
  action: RequestAction;
}
