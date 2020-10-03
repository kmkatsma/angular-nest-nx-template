
export enum AddressAttribute {
  address1 = 'address1',
  address2 = 'address2',
  city = 'city',
  township = 'township',
  state = 'state',
  postalCode = 'postalCode',
  addressTypeId = 'addressTypeId'
}

export class Address {
  public [AddressAttribute.address1]: string;
  public [AddressAttribute.address2]: string;
  public [AddressAttribute.city]: string;
  public [AddressAttribute.township]: number;
  public [AddressAttribute.state]: string;
  public [AddressAttribute.postalCode]: string;
  public [AddressAttribute.addressTypeId]: number;
}

export class OtherAddresses {
  public vacation: Address;
  public secondary: Address;
}

export class AddressMatch {
  public placeId: string;
  public formattedAddress: string;
}

export class AddressValidationResponse {}
