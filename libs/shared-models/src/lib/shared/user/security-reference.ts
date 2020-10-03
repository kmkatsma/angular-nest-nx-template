import { BaseDocument, BaseDocumentField } from '../../base-models';
import { BaseDomainKeyEnum } from '../configuration/domains';

export class SecurityReferenceData extends BaseDocument {
  public roles = new Array<string>();

  constructor() {
    super();
    this[BaseDocumentField.partitionId] = BaseDomainKeyEnum.Security;
  }
}
