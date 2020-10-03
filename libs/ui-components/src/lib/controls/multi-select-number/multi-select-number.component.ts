import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { LogService } from '@ocw/ui-core';
import { Subject } from 'rxjs';
import { FormControlService } from '../../forms/form-control.service';

@Component({
  selector: 'ocw-multi-select-number',
  templateUrl: './multi-select-number.component.html',
})
export class MultiSelectNumberComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() form: FormGroup;
  @Input() controlName: string;
  @Input() selectAllControlName: string;
  @Input() listData: number[];
  @Input() showSelectAll = false;
  @Input() placeHolder: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  selectedItems: string;
  allSelected = false;

  constructor(
    public logService: LogService,
    public formService: FormControlService
  ) {}

  ngOnDestroy() {
    this.logService.debug('ngOnDestroy', this);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.logService.log('MultiSelect init', this.form, this.controlName);
    this.formService.triggerActionOnChange(
      this.controlName,
      this.form,
      this.setDescriptionValues,
      this.ngUnsubscribe
    );
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (this.form && this.controlName) {
      this.setDescriptionValues();
    }
    if (simpleChanges['listData'] && this.listData) {
    }
  }

  selectAll(select: MatSelect) {
    this.formService.selectAllByValue(
      select,
      this.form,
      this.controlName,
      this.allSelected
    );
  }

  setDescriptionValues = () => {
    const values: string[] = this.form.controls[this.controlName].value;
    this.selectedItems = this.formService.buildNumberValueList(values);
  };
}
