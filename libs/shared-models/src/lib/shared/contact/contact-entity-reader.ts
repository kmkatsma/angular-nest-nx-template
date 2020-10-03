import { PartnerDocument } from '../partner/partner-document';
import { ContactEntityFields } from './contact-entity';
import { ContactFieldsReader } from './contact-fields-reader';

export class ContactEntityUtil {
  static contactRelationship(contact: ContactEntityFields): string {
    const relationship = contact.relationship;
    if (relationship) {
      return relationship.val;
    } else {
      return '';
    }
  }
  static contactReferralReason(contact: ContactEntityFields): string {
    return contact.additionalInfo;
  }
  static contactAgency(
    partners: PartnerDocument[],
    contact: ContactEntityFields
  ): string {
    const agency = partners.find((p) => p.id === contact.agencyId);
    if (agency) {
      return agency.name;
    } else {
      return '';
    }
  }
  static contactName(contact: ContactEntityFields): string {
    const name = contact.firstName + ' ' + contact.lastName;
    return name;
  }

  static primaryPhoneNumber(contact: ContactEntityFields) {
    const reader = new ContactFieldsReader(contact.contacts);
    return reader.getPrimaryPhoneNumber();
  }
}
