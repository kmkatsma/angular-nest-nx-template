import { Component, Input } from '@angular/core';
import { ReferenceEntityField } from '@ocw/shared-models';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ocw-text-field',
  template: `
    <mat-form-field [formGroup]="form" style="min-width:250px">
      <input
        matInput
        [placeholder]="field.placeHolder"
        [formControlName]="field.attributeName"
        [maxlength]="field.maxLength"
        spellcheck="false"
        autocomplete="off"
      />
    </mat-form-field>
  `
})
export class TextFieldComponent {
  @Input() field: ReferenceEntityField;
  @Input() form: FormGroup;

  constructor() {}
}
