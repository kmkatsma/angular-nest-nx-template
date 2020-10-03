import { IsDefined, MinLength } from 'class-validator';
import { BaseDocument, IsActive } from '../base-models';

export enum ReferenceValueAttribute {
  uid = 'uid',
  val = 'val',
  name = 'name',
}

export interface IReferenceValue {
  uid: number;
  val: string;
  name?: string;
  isDefault?: boolean;
}

export interface ReferenceKey {
  domainEnum: string;
  attributeEnum: string;
}

export class ReferenceEntity {
  @IsDefined()
  public id: string;
  @IsDefined()
  public [ReferenceValueAttribute.val]: string;
  public [ReferenceValueAttribute.name]: string;

  constructor(id?: string, val?: string) {
    this.id = id;
    this.val = val;
  }
}

export class ReferenceValue implements IReferenceValue {
  @IsDefined()
  public [ReferenceValueAttribute.uid]: number;
  @IsDefined()
  public [ReferenceValueAttribute.val]: string;
  public name?: string;
  public isDefault? = false;
  public isActive? = true;
  public seq?: number;

  constructor(uid?: number, val?: string) {
    this.uid = uid;
    this.val = val;
  }
}

export enum ReferenceItemAttribute {
  uid = 'uid',
  val = 'val',
  name = 'name',
  isDefault = 'isDefault',
  isActive = 'isActive',
  seq = 'seq',
  referenceGroup = 'referenceGroup',
  referenceType = 'referenceType',
}

export class ReferenceItem extends BaseDocument
  implements IReferenceValue, IsActive {
  id: string;
  @IsDefined()
  uid: number;
  val: string;
  name: string;
  @IsDefined()
  @MinLength(1)
  referenceGroup?: string;
  @IsDefined()
  @MinLength(1)
  referenceType?: string;
  isDefault?: boolean;
  isActive = true;
  seq?: number;
  children?: ReferenceItem[];

  constructor(uid?: number, val?: string, name?: string) {
    super();
    this.uid = uid;
    this.val = val;
    if (name) {
      this.name = name;
    } else {
      this.name = val;
    }
  }
}

export class ReferenceDataGroup {
  results: any;
  resultsMap: Map<string, Map<string | number, ReferenceItem>>;
}

export enum AnnualValueField {
  startDt = 'startDt',
  displayYear = 'displayYear',
}

export class AnnualValue extends ReferenceItem {
  startDt: number;
  displayYear: number;
}

export class FiscalYearInfo extends AnnualValue {
  public startDt: number;
  public endDt: number;
}
