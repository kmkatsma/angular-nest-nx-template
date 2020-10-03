import { IsDefined, IsIn, Length, ValidateNested } from 'class-validator';
import { ReferenceItem } from '../reference-base';
import { Type } from 'class-transformer';
import { RequestAction } from '../request-response/request-action';
import {
  ReferenceDataMessages,
  UserMessageTypes,
  PartnerMessages,
} from './message-types';
import { ServiceRequest } from '../request-response/service-response';

export enum BaseDomainKeyEnum {
  Attribute = 'AttributeReferenceData',
  Address = 'AddressReferenceData',
  None = 'None',
  Partner = 'Partner',
  Security = 'SecurityReferenceData',
  User = 'UserInfoDocument',
  Year = 'YearReferenceData',
  System = 'SystemReferenceData',
}

export enum BaseDomainEnum {
  AddressReference = 1,
  AttributeReference = 2,
  PartnerList = 3,
  UserList = 4,
  YearReference = 5,
  SystemReference = 6,
}

export const BaseDomainEnumMessageTypeMap = {
  [BaseDomainEnum.AddressReference]: ReferenceDataMessages.Read,
  [BaseDomainEnum.AttributeReference]: ReferenceDataMessages.Read,
  [BaseDomainEnum.PartnerList]: PartnerMessages.Query,
  [BaseDomainEnum.UserList]: UserMessageTypes.Query,
  [BaseDomainEnum.YearReference]: ReferenceDataMessages.Read,
  [BaseDomainEnum.SystemReference]: ReferenceDataMessages.Read,
};

export const BaseDomainEnumMap = {
  [BaseDomainEnum.AddressReference]: BaseDomainKeyEnum.Address,
  [BaseDomainEnum.AttributeReference]: BaseDomainKeyEnum.Attribute,
  [BaseDomainEnum.YearReference]: BaseDomainKeyEnum.Year,
  [BaseDomainEnum.UserList]: BaseDomainKeyEnum.User,
  [BaseDomainEnum.PartnerList]: BaseDomainKeyEnum.Partner,
  [BaseDomainEnum.SystemReference]: BaseDomainKeyEnum.System,
};

export class GetReferenceDataRequest extends ServiceRequest<string> {
  @IsDefined()
  messageType: string;
  data: string;
  action = RequestAction.Get;
}

export class SaveReferenceDataResponse<T> {
  data: T;
  referenceId: number;
}

export class SaveReferenceDataRequest extends ServiceRequest<ReferenceItem> {
  @IsDefined()
  messageType: string;
  @IsDefined()
  referenceAttribute: string;
  @IsDefined()
  @Length(1)
  domainKey: string;
  @IsDefined()
  @ValidateNested()
  @Type(() => ReferenceItem)
  data: ReferenceItem;
  @IsIn([1, 2, 3])
  action: RequestAction;
}

export class SaveReferenceItemRequest extends ServiceRequest<ReferenceItem> {
  @IsDefined()
  messageType: string;
  @IsDefined()
  referenceAttribute: string;
  @IsDefined()
  domainKey: string;
  @ValidateNested()
  @Type(() => ReferenceItem)
  @IsDefined()
  data: ReferenceItem;
  @IsIn([1, 2, 3])
  action: RequestAction;
}

export enum ReferenceAttributeType {
  SystemDate = 'SystemDate',
  SystemDateTime = 'SystemDateTime',
  ReferenceValue = 'ReferenceValue',
  Boolean = 'Boolean',
  Currency = 'Currency',
  EnumMap = 'EnumMap',
  String = 'String',
  Domain = 'Domain',
  MultiSelect = 'MultiSelect',
  EnumAllowedValues = 'EnumAllowedValues',
  Notes = 'Notes',
}
