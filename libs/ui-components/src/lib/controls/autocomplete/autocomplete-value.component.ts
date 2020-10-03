import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  ViewChild,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AutoCompleteService } from './auto-complete.service';
import {
  ReferenceItem,
  ReferenceValue,
  ReferenceValueAttribute,
} from '@ocw/shared-models';
import { LogService } from '@ocw/ui-core';
import { FormEvent, FormEventType } from '@ocw/ui-core';

@Component({
  selector: 'ocw-autocomplete-value',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <mat-form-field [ngStyle]="style" [formGroup]="formGroup">
      <input
        type="text"
        [placeholder]="placeHolder"
        matInput
        [matAutocomplete]="auto"
        [formControlName]="controlName"
        spellcheck="false"
        [required]="required"
      />
    </mat-form-field>
    <mat-autocomplete
      #auto="matAutocomplete"
      [displayWith]="displayWithIdLookup2"
      (optionSelected)="optionSelect($event)"
    >
      <mat-option
        *ngFor="let option of filteredItem$ | async"
        [value]="getValue(option)"
      >
        {{ displayWithIdLookup(option) }}
      </mat-option>
    </mat-autocomplete>`,
})
export class AutocompleteValueComponent implements OnChanges {
  @Input() placeHolder: string;
  @Input() listData: ReferenceItem[];
  @Input() required = false;
  @Input() formGroup: FormGroup;
  @Input() controlName: any;
  @Input() style: any;
  @Input() valueProperty = 'val';
  @Output() optionSelected: EventEmitter<FormEvent<any>> = new EventEmitter();

  listControl: FormControl;
  filteredItem$: Observable<ReferenceValue[]>;
  filteredItems: ReferenceValue[];
  selectedItem: ReferenceValue;

  constructor(
    private autoCompleteService: AutoCompleteService,
    private logService: LogService
  ) {}

  ngOnChanges() {
    let controlValue: string | ReferenceValue;

    if (this.formGroup && this.controlName) {
      if (this.formGroup.controls[this.controlName]) {
        controlValue = Object.assign(
          {},
          this.formGroup.controls[this.controlName].value
        );
      }
      if (this.required) {
        this.listControl = new FormControl(controlValue, Validators.required);
      } else {
        this.listControl = new FormControl(controlValue);
      }
      if (!this.formGroup.controls[this.controlName]) {
        this.logService.log('add control', this.listControl, controlValue);
        this.formGroup.addControl(this.controlName, this.listControl);
      }
    }
    if (this.formGroup && this.controlName && this.listData) {
      this.filteredItem$ = this.getListObservable(
        this.listData,
        this.formGroup.controls[this.controlName]
      );
    }
  }

  displayWithIdLookup = (option: ReferenceItem) => {
    return this.autoCompleteService.displayReferenceFromLookup(
      option.uid,
      this.listData
    );
  };

  displayWithIdLookup2 = (option: number | string) => {
    return this.autoCompleteService.displayReferenceFromLookupProperty(
      option,
      this.valueProperty,
      this.listData
    );
  };

  filteredItemAbstract$(
    list: ReferenceValue[],
    control: AbstractControl,
    propertyName: string
  ): Observable<ReferenceValue[]> {
    /*this.logService.log('filteritem', control);*/
    let filteredItems: Observable<ReferenceValue[]>;
    if (list) {
      filteredItems = control.valueChanges.pipe(
        startWith(null),
        map((item) =>
          item && typeof item === 'object' ? item[propertyName] : item
        ),
        map((value) => (value ? this.filter(value) : list.slice()))
      );
    }
    return filteredItems;
  }

  getListObservable(
    referenceList: Array<ReferenceItem>,
    control: AbstractControl
  ): Observable<ReferenceValue[]> {
    return this.filteredItemAbstract$(
      referenceList.map(function (val) {
        return Object.assign({}, val);
      }),
      control,
      'val'
    );
  }

  private filter(name: string | number): ReferenceValue[] {
    const filterValue = name.toString().toLowerCase();

    const options = this.listData.filter(
      (option) =>
        option[ReferenceValueAttribute.val]
          .toString()
          .toLowerCase()
          .indexOf(filterValue) === 0
    );
    this.logService.log('options, filter', options, filterValue);
    if (options.length === 1) {
      this.selectedItem = options[0];
    } else {
      this.selectedItem = undefined;
    }
    return options;
  }

  optionSelect(event: any) {
    this.logService.log('options selected', event);
    this.optionSelected.emit(
      new FormEvent(event, undefined, FormEventType.Update)
    );
  }

  getValue(option: ReferenceValue) {
    return option[this.valueProperty];
  }
}
