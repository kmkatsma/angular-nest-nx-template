import { ReferenceItem } from '../reference-base';
import { IsDefined } from 'class-validator';
import { BaseDocument, BaseDocumentField } from '../../base-models';

export enum AddressReferenceDataType {
  cities = 'cities',
  postalCodes = 'postalCodes',
  states = 'states',
  townships = 'townships'
}

export class AddressReferenceData extends BaseDocument {
  @IsDefined()
  public cities: City[] = [];
  @IsDefined()
  public postalCodes: PostalCode[] = [];
  @IsDefined()
  public states: ReferenceItem[] = [];
  @IsDefined()
  public townships: Township[] = [];

  constructor() {
    super();
    this[BaseDocumentField.partitionId] = 'AddressReferenceData';
  }
}

export class Township extends ReferenceItem {
  public code: string;
  public cpoeTownshipCode: string;
}

export class City extends ReferenceItem {
  public townships = new Array<TownshipInfo>();
  public cityCode: string;
}

export class PostalCode extends ReferenceItem {
  public cities: CityInfo[] = [];
}

export class TownshipInfo {
  public postalCode: string;
  public townshipId: number;
  public isDefault: boolean;
}

export class CityInfo {
  public cityId: number;
  public isDefault: boolean;
}


export const addressReferenceDataValidations = {
  [AddressReferenceDataType.cities]: {
    typedInstance: new City()
  },
  [AddressReferenceDataType.postalCodes]: {
    typedInstance: new PostalCode()
  },
  [AddressReferenceDataType.states]: {
    typedInstance: new  ReferenceItem()
  },
  [AddressReferenceDataType.townships]: {
    typedInstance: new Township()
  },
  
};  
 