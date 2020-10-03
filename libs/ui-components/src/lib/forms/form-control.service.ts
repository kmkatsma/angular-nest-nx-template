import { ElementRef, Injectable } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LogService } from '@ocw/ui-core';
import { MatSelect } from '@angular/material/select';
import * as R from 'rambda';
import { ReferenceItem } from '@ocw/shared-models';
import { ValidatorService } from './validator.service';
import { FORM_MODE } from './enums';

const sortFn = (a, b) => a - b;

export class LinkedFields {
  constructor(
    public field: FieldInfo,
    public dependentFields: Array<FieldInfo>
  ) {}
}
export class FieldInfo {
  constructor(public placeHolder: string, public formControlName: string) {}
}

@Injectable({
  providedIn: 'root',
})
export class FormControlService {
  constructor(
    private logService: LogService,
    private validatorService: ValidatorService
  ) {}

  getFormGroup(form: FormGroup, groupName: string): FormGroup {
    return form.get(groupName) as FormGroup;
  }

  public populateSubFormFromModel<T>(
    document: T,
    form: FormGroup,
    entityName: string
  ) {
    this.logService.log('subform', document, form, entityName);
    const subForm = this.getFormGroup(form, entityName);
    /*if (subForm && document[entityName]) {*/
    subForm.patchValue(Object.assign({}, document[entityName]), {
      onlySelf: true,
      emitEvent: false,
    });
    this.logService.log('subform after patch', entityName, subForm);
    //}
  }

  public updateModelFromSubForm<T>(
    modelToUpdate: T,
    form: FormGroup,
    entityName: string
  ) {
    const formInstance = this.getFormGroup(form, entityName);
    const newValues = Object.assign(
      {},
      modelToUpdate[entityName],
      formInstance.getRawValue()
    );
    this.logService.log(
      '[FormControlService.updateModelFromForm]',
      modelToUpdate[entityName],
      newValues
    );
    modelToUpdate[entityName] = newValues;
  }

  public getFormTitle(entityName: string, formMode: FORM_MODE) {
    let title = '';
    if (formMode === FORM_MODE.UPDATE) {
      title = 'Edit';
    } else {
      title = 'Add';
    }
    title = `${title} ${entityName}`;
    return title;
  }

  triggerActionOnChange(
    formControlName: string,
    form: FormGroup,
    functionToExecute: Function,
    ngUnsubscribe: Subject<void>
  ) {
    form
      .get(formControlName)
      .valueChanges.pipe(takeUntil(ngUnsubscribe))
      .subscribe((val) => {
        functionToExecute();
      });
  }

  setControlsEnabledState(
    isEnabled: boolean,
    form: FormGroup,
    ...fields: string[]
  ) {
    for (let i = 0; i < fields.length; i++) {
      if (isEnabled) {
        form.controls[fields[i]].enable();
      } else {
        form.controls[fields[i]].disable();
      }
    }
  }

  createYesNoControl(value: string): FormControl {
    return new FormControl(
      value || '',
      Validators.pattern(this.validatorService.yesNoRegex())
    );
  }

  getNumberValue(value: number): number {
    if (!value) {
      return 0;
    } else {
      return value;
    }
  }

  clear(form: FormGroup) {
    form.reset();
    form.markAsPristine();
    form.markAsUntouched();
    Object.keys(form.controls).forEach((key) => {
      form.get(key).markAsPristine();
      form.get(key).markAsUntouched();
    });
  }

  clearErrors(form: FormGroup) {
    form.markAsPristine();
    form.markAsUntouched();
    Object.keys(form.controls).forEach((key) => {
      form.get(key).markAsPristine();
      form.get(key).markAsUntouched();
    });
  }

  setUpperCase(formGroup: FormGroup, value: KeyboardEvent, field: string) {
    if (value) {
      this.logService.debug('key press', value, field);
      const patchObject = {};
      patchObject[field] = value.key.toUpperCase();
      formGroup.patchValue(patchObject);
    } else {
      return;
    }
  }

  numericKeyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  disableOnEmptyValue(field: AbstractControl, dependentField: AbstractControl) {
    this.logService.log('disable on empty', field, dependentField);
    if (field && dependentField) {
      if (field.value && field.value !== '') {
        dependentField.enable({ emitEvent: false });
      } else {
        this.logService.log('disable field');
        dependentField.setValue('', { emitEvent: false });
        dependentField.disable({ emitEvent: false });
      }
    }
  }

  enableOnSpecificValue(
    field: AbstractControl,
    dependentField: AbstractControl,
    value: any
  ) {
    if (field && dependentField) {
      if (field.value && field.value === value) {
        dependentField.enable({ emitEvent: false });
      } else {
        dependentField.setValue('', { emitEvent: false });
        dependentField.disable({ emitEvent: false });
      }
    }
  }

  disableFieldOnYes(
    formGroup: FormGroup,
    formGroupInplace: FormGroup,
    field: string,
    validators?: ValidatorFn
  ) {
    if (formGroup && formGroupInplace && formGroupInplace.controls[field]) {
      //console.log(field, formGroup.controls[field].value);
      if (
        formGroup.controls[field].value === 'Y' ||
        formGroup.controls[field].value === 'y'
      ) {
        formGroupInplace.controls[field].enable({ emitEvent: false });
        if (validators) {
          formGroupInplace.controls[field].setValidators(validators);
        }
      } else {
        formGroupInplace.controls[field].setValue('', { emitEvent: false });
        formGroupInplace.controls[field].disable({ emitEvent: false });
        if (validators) {
          formGroupInplace.controls[field].clearValidators();
        }
      }
    }
  }

  disableFieldOnNo(
    formGroup: FormGroup,
    formGroupReason: FormGroup,
    field: string,
    validators?: ValidatorFn
  ) {
    if (formGroup && formGroupReason && formGroupReason.controls[field]) {
      if (
        formGroup.controls[field].value === 'N' ||
        formGroup.controls[field].value === 'n'
      ) {
        formGroupReason.controls[field].enable();
        if (validators) {
          formGroupReason.controls[field].setValidators(validators);
        }
      } else {
        formGroupReason.controls[field].setValue('');
        formGroupReason.controls[field].disable();
        if (validators) {
          formGroupReason.controls[field].clearValidators();
        }
      }
    }
  }

  moveToNextInput(value: KeyboardEvent, elements: any) {
    const sourceElement = new ElementRef(value.target);
    //this.logService.log('current Element', sourceElement);
    for (let i = 0; i < elements.length; i++) {
      const currentElement = elements.item(i);
      const nextElement = elements.item(i + 1);
      const skipElement = elements.item(i + 2);
      const skipTwoElement = elements.item(i + 3);
      //this.logService.log('current Element', currentElement);
      //this.logService.log('next Element', nextElement);
      const nativeElement = sourceElement.nativeElement as HTMLElement;
      if (nativeElement.id === currentElement.id) {
        if (nextElement && !nextElement.disabled) {
          nextElement.focus();
          nextElement.select();
          break;
        }
        if (skipElement && !skipElement.disabled) {
          skipElement.focus();
          nextElement.select();
          break;
        }
        if (skipTwoElement && !skipTwoElement.disabled) {
          skipTwoElement.focus();
          nextElement.select();
          break;
        }
      }
    }
  }

  public addYesNoLinkedFields(
    form: FormGroup,
    ngUnsubscribe: Subject<void>,
    field1: FieldInfo,
    dependentFields: FieldInfo[]
  ): LinkedFields {
    form
      .get(field1.formControlName)
      .valueChanges.pipe(takeUntil(ngUnsubscribe))
      .subscribe((val) => {
        dependentFields.forEach((field) => {
          this.setYesNoEnableState(form, val, field.formControlName);
        });
      });
    return new LinkedFields(field1, dependentFields);
  }

  private setYesNoEnableState(form: FormGroup, val: string, fieldName: string) {
    if (val && val.toUpperCase() === 'Y') {
      form.controls[fieldName].enable({ emitEvent: false });
    } else {
      form.controls[fieldName].setValue('', { emitEvent: false });
      form.controls[fieldName].disable({ emitEvent: false });
    }
  }

  selectAll(
    select: MatSelect,
    form: FormGroup,
    formControlName: string,
    selectAllControlName: string
  ) {
    this.logService.log(
      'selectAll value',
      form.controls[selectAllControlName].value
    );
    const selectedIds = new Array<number>();
    if (form.controls[selectAllControlName].value !== true) {
      select.options.forEach((element) => {
        selectedIds.push(element.value);
      });
    }
    form.controls[formControlName].setValue(selectedIds);
  }

  selectAllByValue(
    select: MatSelect,
    form: FormGroup,
    formControlName: string,
    value: boolean
  ) {
    this.logService.log('selectAll value', value);
    const selectedIds = new Array<number>();
    if (value !== true) {
      select.options.forEach((element) => {
        selectedIds.push(element.value);
      });
    }
    form.controls[formControlName].setValue(selectedIds);
  }

  buildDescriptionList<T>(
    values: string[],
    fullList: ReferenceItem[],
    propertyName: string,
    displayPropertyName: string
  ): string {
    this.logService.log(
      'buildDescriptionList',
      propertyName,
      displayPropertyName,
      values,
      fullList
    );
    let descriptions = [];
    if (values && fullList) {
      values.forEach((id) => {
        const sc = fullList.find((p) => p[propertyName] === id);
        if (sc) {
          descriptions.push(sc[displayPropertyName]);
        }
      });
    }

    descriptions = R.sort(sortFn)(descriptions);
    return descriptions.join(', ');
  }

  buildDescriptionArray<T>(
    values: string[],
    fullList: ReferenceItem[],
    propertyName = 'uid',
    displayPropertyName = 'val'
  ) {
    const stringList = this.buildDescriptionList(
      values,
      fullList,
      propertyName,
      displayPropertyName
    );
    if (stringList) {
      return stringList.split(',');
    } else {
      return [];
    }
  }

  buildNumberValueList<T>(values: string[]): string {
    this.logService.log('buildDescriptionList', values);
    let descriptions = [];
    descriptions = R.sort(sortFn)(values);
    return descriptions.join(',');
  }
}
