import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReferenceEntityField } from '@ocw/shared-models';

@Component({
  selector: 'ocw-select-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field [formGroup]="form" style="min-width:250px">
      <mat-select
        [placeholder]="field.placeHolder"
        [formControlName]="field.attributeName"
      >
        <mat-option
          *ngFor="let item of referenceData[field.domainAttributeName]"
          matInput
          [value]="item.uid"
          style="padding-bottom: 5px"
          >{{ item.val }}</mat-option
        >
      </mat-select>
    </mat-form-field>
  `
})
export class SelectFieldComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() field: ReferenceEntityField;
  @Input() referenceData: any;

  constructor() {}

  ngOnInit() {}
}
