export enum PartnerMessages {
  Mutate = 'PartnerMutate',
  Read = 'PartnerRead',
  Query = 'PartnerQuery',
  QueryYear = 'PartnerYearQuery',
  MutateYear = 'PartnerYearMutate',
  CloneYear = 'PartnerYearClone',
}

export enum ReferenceDataMessages {
  Mutate = 'ReferenceDataMutate',
  Read = 'ReferenceDataRead',
}

export enum AttributeValueMessages {
  Mutate = 'AttributeValueMutate',
  Read = 'AttributeValueRead',
  Query = 'AttributeValueQuery',
}

export enum UserMessageTypes {
  UserGetCurrent = 'UserGetCurrent',
  Query = 'UserQuery',
  Mutate = 'Mutate',
}

export enum NoteMessages {
  Mutate = 'NoteMutate',
  Query = 'NoteQuery',
}

export enum AddressValidationMessages {
  Get = 'AddressGet',
  Match = 'AddressMatch',
}

export enum DocumentMessages {
  Upload = 'DocumentUpload',
  Get = 'DocumentGet',
  Mutate = 'DocumentMutate',
  Query = 'DocumentQuery',
  TemplateList = 'DocumentTemplateQuery',
}

export enum AuditEventMessages {
  Query = 'Query',
}

export enum TenantMessages {
  GetAll = 'TenantsGetAll',
  Mutate = 'TenantMutate',
}
