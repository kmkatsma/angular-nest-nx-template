import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ReferenceItem } from '@ocw/shared-models';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ocw-select',
  template: `
    <mat-form-field [ngStyle]="style" [formGroup]="formGroup">
      <mat-label>{{ placeHolder }}</mat-label>
      <mat-select [formControlName]="controlName">
        <mat-option
          *ngFor="let option of listData"
          [value]="option[valueProperty]"
        >
          {{ option[displayProperty] }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `
})
export class SelectComponent implements OnInit, OnChanges {
  @Input() placeHolder: string;
  @Input() listData: ReferenceItem[];
  @Input() formGroup: FormGroup;
  @Input() controlName: any;
  @Input() style: any;
  @Input() includeBlank = false;
  @Input() valueProperty = 'uid';
  @Input() displayProperty = 'val';

  constructor() {}

  ngOnInit() {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['listData'] && this.listData && this.includeBlank) {
      const blank = new ReferenceItem(0, '');
      //const newList = [];
      //newList.push(blank, this.listData);
      //this.listData = CloneUtil.cloneDeep(this.listData);
      //this.listData.push(blank);
    }
  }
}
