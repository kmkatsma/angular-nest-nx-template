import { IsDefined, Length, MinLength } from 'class-validator';
import { BaseDocument, BaseDocumentField } from '../../base-models';
import { ReferenceItem } from '../reference-base';
import { ContactType } from '../contact/contact';

export enum GenderEnum {
  Female = 1,
  Male = 2,
  Other = 3,
}

export enum PersonReferenceTypes {
  races = 'races',
  ethnicities = 'ethnicities',
  languages = 'languages',
  relationshipTypes = 'relationshipTypes',
  contactTypes = 'contactTypes',
  suffixes = 'suffixes',
  titles = 'titles',
  maritalStatuses = 'maritalStatuses',
  genders = 'genders',
  otherContactTypes = 'otherContactTypes',
}

export class PersonReferenceData extends BaseDocument {
  [PersonReferenceTypes.contactTypes]: ContactType[] = [];
  [PersonReferenceTypes.otherContactTypes]: ReferenceItem[] = [];
  [PersonReferenceTypes.suffixes]: ReferenceItem[] = [];
  [PersonReferenceTypes.titles]: ReferenceItem[] = [];
  [PersonReferenceTypes.maritalStatuses]: ReferenceItem[] = [];
  [PersonReferenceTypes.genders]: ReferenceItem[] = [];
  [PersonReferenceTypes.races]: Race[] = [];
  [PersonReferenceTypes.ethnicities]: Race[] = [];
  [PersonReferenceTypes.languages]: ReferenceItem[] = [];
  [PersonReferenceTypes.relationshipTypes]: ReferenceItem[] = [];

  constructor() {
    super();
    this[BaseDocumentField.partitionId] = 'PersonReferenceData';
  }
}

export class Ethnicity extends ReferenceItem {
  @IsDefined()
  @MinLength(1)
  code: string;
  //move data to report config
  //customLabels = new Map<string, string>();
}
export class Race extends ReferenceItem {
  @IsDefined()
  @MinLength(1)
  code: string;
  //TODO: move data to report config
  // customLabels = new Map<string, string>();
}

export const personDataValidations = {
  [PersonReferenceTypes.contactTypes]: {
    typedInstance: new ContactType(),
  },
  [PersonReferenceTypes.otherContactTypes]: {
    typedInstance: new ReferenceItem(),
  },
  [PersonReferenceTypes.suffixes]: {
    typedInstance: new ReferenceItem(),
  },
  [PersonReferenceTypes.titles]: {
    typedInstance: new ReferenceItem(),
  },

  [PersonReferenceTypes.maritalStatuses]: {
    typedInstance: new ReferenceItem(),
  },
  [PersonReferenceTypes.genders]: {
    typedInstance: new ReferenceItem(),
  },
  [PersonReferenceTypes.ethnicities]: {
    typedInstance: new ReferenceItem(),
  },
  [PersonReferenceTypes.races]: {
    typedInstance: new Race(),
  },
  [PersonReferenceTypes.languages]: {
    typedInstance: new ReferenceItem(),
  },
  [PersonReferenceTypes.relationshipTypes]: {
    typedInstance: new ReferenceItem(),
  },
};
