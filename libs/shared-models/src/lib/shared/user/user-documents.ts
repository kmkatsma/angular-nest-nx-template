import { IsDefined, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDocument } from '../../base-models';
import { RequestAction } from '../request-response/request-action';
import { ReferenceItemAttribute, ReferenceItem } from '../reference-base';
import { BaseDomainKeyEnum } from '../configuration/domains';
import { ServiceRequest } from '../request-response/service-response';

export class UserInfoFilter {
  emailAddress: string;
  userId: string;
  constituentId: string;
  providerId: string;
  tenantId: string;
}

export class UserInfoSearchRequest extends ServiceRequest<UserInfoFilter> {
  data: UserInfoFilter = new UserInfoFilter();
}

export class UserProfileSearchRequest extends ServiceRequest<UserInfoFilter> {
  data: UserInfoFilter = new UserInfoFilter();
}

export class UserInfoReferenceData extends BaseDocument {
  [BaseDomainKeyEnum.User]: UserInfoDocument[] = [];
}

export enum UserInfoAttribute {
  providerId = 'providerId',
  userId = 'userId',
  emailAddress = 'emailAddress',
  locationId = 'locationId',
  roles = 'roles',
  tenantId = 'tenantId',
  tenantState = 'tenantState',
  firstName = 'firstName',
  fullName = 'fullName',
  lastName = 'lastName',
  startDate = 'startDate',
  endDate = 'endDate',
  tenantFeatures = 'tenantFeatures',
}

export class UserInfoDocument extends ReferenceItem {
  [UserInfoAttribute.userId]: string;
  @IsDefined()
  [UserInfoAttribute.emailAddress]: string;
  @IsDefined()
  [UserInfoAttribute.locationId]: number;
  [UserInfoAttribute.firstName]: string;
  [UserInfoAttribute.lastName]: string;
  [UserInfoAttribute.fullName]: string;
  [UserInfoAttribute.tenantId]: number;
  [UserInfoAttribute.startDate]: number;
  [UserInfoAttribute.endDate]: number;
  [UserInfoAttribute.tenantState]: string;
  [UserInfoAttribute.tenantFeatures]: number[];
  [UserInfoAttribute.providerId]: string;
  @IsDefined()
  [UserInfoAttribute.roles]: number[];
  [ReferenceItemAttribute.referenceGroup] = BaseDomainKeyEnum.User;
  [ReferenceItemAttribute.referenceType] = BaseDomainKeyEnum.User;
}

export class SaveUserInfoRequest extends ServiceRequest<UserInfoDocument> {
  @ValidateNested()
  @Type(() => UserInfoDocument)
  @IsDefined()
  data: UserInfoDocument = new UserInfoDocument();
  @IsIn([1, 2, 3])
  action: RequestAction;
}

export enum UserProfileAttribute {
  emailAddress = 'emailAddress',
  serviceReports = 'serviceReports',
}

export class UserProfileDocument extends BaseDocument {
  @IsDefined()
  [UserProfileAttribute.emailAddress]: string;
}

export class SaveUserProfileRequest extends ServiceRequest<
  UserProfileDocument
> {
  @ValidateNested()
  @Type(() => UserProfileDocument)
  @IsDefined()
  data: UserProfileDocument = new UserProfileDocument();
  @IsIn([1, 2, 3])
  action: RequestAction;
}

export enum BaseSecurityRoleEnum {
  Admin = 1,
}
