import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ValidatorService } from './validator.service';
import { LogService } from '@ocw/ui-core';

@Injectable({
  providedIn: 'root',
})
export class FormArrayService {
  constructor(
    private logService: LogService,
    private validationService: ValidatorService,
    private formBuilder: FormBuilder
  ) {}

  addNewFormArrayItem(
    form: FormGroup,
    formArray: FormArray,
    arrayItemForm: FormGroup,
    triggerValidation?: boolean
  ) {
    if (triggerValidation) {
      this.validationService.triggerFormValidation(form);
      if (!form.valid) {
        this.validationService.publishError('Please fix validation errors');
        return;
      }
    }
    this.createArrayItemControl(formArray, arrayItemForm);
    arrayItemForm.setParent(formArray);
  }

  createArrayItemControl(formArray: FormArray, formItem: FormGroup) {
    formItem.setParent(formArray);
    formArray.controls.push(formItem);
  }

  removeArrayControl(formArray: FormArray, index: number) {
    formArray.controls.splice(index, 1);
  }

  getArrayControlByIndex(formArray: FormArray, index: number): FormGroup {
    return formArray.controls[index] as FormGroup;
  }

  createFormGroupFromObject(item: any) {
    return this.formBuilder.group(item);
  }

  getFormArray(gapForm: FormGroup, formArrayName: string) {
    const array = gapForm.controls[formArrayName] as FormArray;
    return array;
  }

  createAndPopulateFormArray(
    parentForm: FormGroup,
    sourceObject: any,
    formArrayName: string,
    triggerFormValidation?: boolean
  ) {
    if (!sourceObject[formArrayName]) {
      sourceObject[formArrayName] = [];
    }
    const formArray = this.getFormArray(parentForm, formArrayName);
    sourceObject[formArrayName].forEach((rule) => {
      const arrayEntry = this.createFormGroupFromObject(rule);
      this.addNewFormArrayItem(
        parentForm,
        formArray,
        arrayEntry,
        triggerFormValidation
      );
    });
    this.logService.log('form array' + formArrayName, formArray);
    return formArray;
  }
}
