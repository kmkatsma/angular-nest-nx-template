import { FormArray, FormGroup } from '@angular/forms';
import {
  ReferenceItem,
  ReferenceDataInfo,
  ReferenceEntityField
} from '@ocw/shared-models';

export class ReferenceDataInfoGroup {
  name: string;
  referenceDataList: ReferenceDataInfo[];
}

export interface IReferenceDataService {
  referenceItem: ReferenceItem;
  dataList(ReferenceItem): ReferenceItem[] | ReferenceEntityField[];
  initializeItem(val: ReferenceItem): void;
  createChildListConfig(): ReferenceDataInfo;
  createForms(): { form: FormGroup; formArray: FormArray };
  createDetailForm(): FormGroup;
  getFormArray(form: FormGroup): FormArray;
}
