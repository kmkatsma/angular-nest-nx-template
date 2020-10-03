import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReferenceEntityField } from '@ocw/shared-models';

@Injectable({
  providedIn: 'root',
})
export class ComponentListService {
  constructor(private formBuilder: FormBuilder) {}

  createFormGroup(fields: ReferenceEntityField[]) {
    if (!fields) {
      return;
    }
    const form = this.formBuilder.group({});
    fields.forEach((p) => {
      form.addControl(p.attributeName, new FormControl(''));
      if (p.required) {
        form.controls[p.attributeName].setValidators(Validators.required);
      }
    });
    return form;
  }
}
