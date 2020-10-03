import { Injectable } from '@angular/core';
import {
  ReferenceItem,
  SaveReferenceDataRequest,
  RequestAction,
  BaseResourceEnum,
  ReferenceDataInfo,
} from '@ocw/shared-models';
import { ResourceStoreService, LogService } from '@ocw/ui-core';
import { FormGroup } from '@angular/forms';
import { CloneUtil } from '@ocw/shared-core';
import { FormService } from '../forms/form.service';
import { FORM_MODE } from '../forms/enums';

@Injectable({
  providedIn: 'root',
})
export class ReferenceDataService {
  constructor(
    private resourceService: ResourceStoreService,
    private formService: FormService,
    private logService: LogService
  ) {}

  getFormTitle(referenceDataInfo: ReferenceDataInfo, mode: FORM_MODE) {
    return this.formService.getFormTitle(referenceDataInfo.displayName, mode);
  }

  createSaveRequest(
    mode: FORM_MODE,
    clone: ReferenceItem,
    referenceDataInfo: ReferenceDataInfo
  ) {
    const request = new SaveReferenceDataRequest();
    if (mode === FORM_MODE.UPDATE) {
      request.action = RequestAction.Update;
    }
    if (mode === FORM_MODE.ADD) {
      if (referenceDataInfo.domainAttributeName) {
        clone.id = '0';
        clone.uid = 0;
        clone.referenceType = referenceDataInfo.domainAttributeName;
        clone.referenceGroup = referenceDataInfo.domainKeyEnum;
      }
      request.action = RequestAction.Create;
    }
    request.data = clone;
    request.referenceAttribute = referenceDataInfo.domainAttributeName;
    request.domainKey = referenceDataInfo.domainKeyEnum;
    request.messageType = referenceDataInfo.saveMessageType;
    return request;
  }

  save<T extends ReferenceItem>(
    selectedItem: T,
    form: FormGroup,
    mode: FORM_MODE,
    referenceData: ReferenceDataInfo
  ) {
    this.logService.log('ReferenceDataService.Save', form.value, selectedItem);

    const formModel = form.getRawValue();
    const clone = CloneUtil.cloneDeep(selectedItem);
    const docToSave: T = Object.assign({}, clone, formModel);

    this.saveReferenceData(mode, docToSave, referenceData);
    this.logService.log('value before save', selectedItem);
  }

  saveReferenceData(
    mode: FORM_MODE,
    clone: ReferenceItem,
    referenceDataInfo: ReferenceDataInfo
  ) {
    const request = new SaveReferenceDataRequest();
    if (mode === FORM_MODE.UPDATE) {
      request.action = RequestAction.Update;
    }
    if (mode === FORM_MODE.ADD) {
      if (referenceDataInfo.domainAttributeName) {
        clone.id = '0';
        clone.uid = 0;
        clone.referenceType = referenceDataInfo.domainAttributeName;
        clone.referenceGroup = referenceDataInfo.domainKeyEnum;
      }
      request.action = RequestAction.Create;
    }
    request.data = clone;
    request.referenceAttribute = referenceDataInfo.domainAttributeName;
    request.domainKey = referenceDataInfo.domainKeyEnum;
    request.messageType = referenceDataInfo.saveMessageType;
    this.resourceService.executeServiceRequest(
      request,
      BaseResourceEnum.ReferenceEntity
    );
  }

  maxId(array: any[], idField: string) {
    let maxId = 0;
    array.forEach((value) => {
      const id = this.getNumberValue(value[idField]);
      if (id > maxId) {
        maxId = id;
      }
    });
    return maxId;
  }

  getNumberValue(value: any): number {
    if (isNaN(value)) {
      return 0;
    } else {
      return value;
    }
  }
}
