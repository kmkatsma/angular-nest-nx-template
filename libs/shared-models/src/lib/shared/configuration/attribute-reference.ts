import { Type } from 'class-transformer';
import {
  IsDefined,
  IsIn,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { AuditBase, BaseDocument, BaseDocumentField } from '../../base-models';
import { ReferenceItem, ReferenceValue } from '../reference-base';
import { RequestAction } from '../request-response/request-action';
import { ColumnDefinition } from '../request-response/search-result';
import { ServiceRequest } from '../request-response/service-response';
import { ReferenceAttributeType } from './domains';

export enum AttributeReferenceType {
  attributes = 'attributes',
}

export class AttributeReferenceData extends BaseDocument {
  public [AttributeReferenceType.attributes] = new Array<AttributeDefinition>();

  constructor() {
    super();
    this[BaseDocumentField.partitionId] = 'AttributeReferenceData';
  }
}

export enum ButtonType {
  Fab = 1,
  Raised = 2,
}

export class ButtonConfig {
  buttonType: ButtonType;
  buttonLabel: string;
}

export class AttributeDefinition extends ReferenceItem {
  @IsDefined()
  public attributeCategory: string;
  @IsDefined()
  public attributeType: string;
  public placeholderName: string;
  public allowedValues = new Array<ReferenceItem>();
  public showAsList: boolean;
  public isActive = false;
  public DataType: AttributeDataType;
  public FieldType: FieldType;
}

export enum AttributeDataType {
  ReferenceValue = 1,
  String = 2,
  Boolean = 3,
}

export enum FieldType {
  Select = 1,
  Table = 2,
  TextBox = 3,
  CheckBox = 4,
}

export enum AttributeType {
  Fall = 1,
  Hospitalization = 2,
}

export enum AttributeValueFields {
  entityId = 'entityId',
  entityType = 'entityType',
  attributeType = 'attributeType',
  value = 'value',
}

export class AttributeValue<T> extends BaseDocument {
  entityId: number;
  entityType: string;
  attributeType: string;
  value: T;
}

export class AttributeValueSearchRequest {
  entityId: number;
  entityIdList: string[] = [];
  entityType: string;
  attributeType: string;
}

export enum AttributeField {
  valueList = 'entries',
}

export enum AttributeEntryField {
  value = 'refVal',
  valueDate = 'ts',
  uid = 'uid',
}

export class AttributeEntry extends AuditBase {
  public [AttributeEntryField.uid]: number;
  @IsDefined()
  public [AttributeEntryField.value]: number | string;
  @IsNumber()
  @Min(1)
  public [AttributeEntryField.valueDate]: number;
}

export class ConstituentAttribute extends AuditBase {
  @IsDefined()
  public [AttributeField.valueList]: AttributeEntry[];
  public constructor() {
    super();
    this[AttributeField.valueList] = new Array<AttributeEntry>();
  }
}

export class SaveAttributeRequest<T> extends ServiceRequest<AttributeValue<T>> {
  @IsDefined()
  messageType: string;
  @ValidateNested()
  @Type(() => AttributeValue)
  @IsDefined()
  data: AttributeValue<T>;
  @IsIn([1, 2, 3])
  action: RequestAction;
}

export enum ReferenceEntityAttribute {
  attributeName = 'attributeName',
  attributeType = 'attributeType',
  placeHolder = 'placeHolder',
  domainKey = 'domainKey',
  domainEnum = 'domainEnum',
  domainAttributeName = 'domainAttributeName',
}

export class ReferenceEntityField {
  attributeName: string;
  attributeType: ReferenceAttributeType;
  allowedValues?: ReferenceValue[];
  placeHolder: string;
  domainKey?: string;
  domainEnum?: number;
  domainAttributeName?: string;
  maxLength? = 100;
  required? = false;
}

export enum SystemCustomForms {
  Constituent = 1,
  Assessment = 2,
  Intake = 3,
}

export enum FormSectionField {
  fields = 'fields',
  list = 'list',
}

export enum FormSectionType {
  Fields = 1,
  List = 2,
}

export class FormSection extends ReferenceItem {
  inCard = true;
  sectionType: FormSectionType;
  fields?: ReferenceEntityField[] = [];
  list?: ReferenceEntityField;
}

export enum FormDefinitionField {
  sections = 'sections',
}

export class FormDefinition extends ReferenceItem {
  sections: FormSection[] = [];
}

export class ComponentListConfig {
  title: string;
  entityInstance: ReferenceItem;
  listItemFields: ReferenceEntityField[];
  listItemListConfig: ComponentListConfig;
  allowAdd = true;
  allowInactive? = true;
}

export class ReferenceDataInfo {
  getMessageType: string;
  saveMessageType: string;
  domainKeyEnum: string;
  domainAttributeName: string;
  domainEnum: number;
  searchEnum?: number;
  resourceEnum?: number;
  displayName: string;
  icon?: string;
  description?: string;
  columns: ColumnDefinition[];
  componentRoute: string;
  customFields?: ReferenceEntityField[];
  allowAdd = true;
  allowInactive? = true;
  hideNameField? = false;
  hideValField? = false;
  componentDef?: FormDefinition;
  childReference?: ReferenceDataInfo;
  isDocument? = false;
}

export class PermissionDataInfo {
  uid: number;
  domainEnum: number;
  domainKeyEnum: string;
  domainAttributeName: string;
  displayName: string;
  icon?: string;
  description?: string;
}
