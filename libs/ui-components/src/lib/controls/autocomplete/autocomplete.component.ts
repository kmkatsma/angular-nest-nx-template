import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  ViewChild,
  Output,
  EventEmitter,
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
import { LogService, FormEvent, FormEventType } from '@ocw/ui-core';

@Component({
  selector: 'ocw-autocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field [ngStyle]="style" [formGroup]="formGroup">
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
      [displayWith]="displayWith"
      (closed)="onClosed()"
      (optionSelected)="optionSelect($event)"
    >
      <mat-option
        *ngFor="let option of filteredItem$ | async"
        [value]="getValue(option)"
      >
        {{ displaySelectValue(option) }}
      </mat-option>
    </mat-autocomplete>
  `,
})
export class AutoCompleteComponent implements OnChanges {
  @Input() placeHolder: string;
  @Input() listData: ReferenceItem[];
  @Input() required = false;
  @Input() formGroup: FormGroup;
  @Input() controlName: any;
  @Input() value: ReferenceValue;
  @Input() style: any;
  @Input() displayFunction: any;
  @Input() useInputValue = false;
  @Output() optionSelected: EventEmitter<FormEvent<any>> = new EventEmitter();

  listControl: FormControl;
  displayWith = this.autoCompleteService.displayReferenceWithCustomField;
  displaySelectValue = this.autoCompleteService.displayReferenceWithCustomField;
  filteredItem$: Observable<ReferenceValue[]>;
  filteredItems: ReferenceValue[];
  selectedItem: ReferenceValue;
  // ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private autoCompleteService: AutoCompleteService,
    private logService: LogService
  ) {}

  ngOnChanges() {
    let controlValue: string | ReferenceValue;
    if (this.displayFunction) {
      this.displaySelectValue = this.displayFunction;
      this.displayWith = this.displayFunction;
    }
    if (this.formGroup && this.controlName) {
      if (this.formGroup.controls[this.controlName]) {
        controlValue = Object.assign(
          {},
          this.formGroup.controls[this.controlName].value
        );
      }
      if (this.required) {
        if (this.value) {
          controlValue = this.value;
        }
        this.listControl = new FormControl(controlValue, Validators.required);
      } else {
        controlValue = this.value;
        this.listControl = new FormControl(controlValue);
      }
      if (!this.formGroup.controls[this.controlName]) {
        this.logService.log('add control', this.listControl, controlValue);
        this.formGroup.addControl(this.controlName, this.listControl);
      } else {
        if (this.value && controlValue) {
          this.logService.log('auto setvalue', controlValue);
          this.formGroup.controls[this.controlName].setValue(controlValue);
        } else if (this.useInputValue) {
          this.logService.log('empty control value', controlValue);
          this.formGroup.controls[this.controlName].setValue(controlValue);
        }
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
    this.logService.log('displayWIthIdLookup', option, this.listData);
    return this.autoCompleteService.displayReferenceFromLookup(
      option.uid,
      this.listData
    );
  };

  displayWithIdLookup2 = (option: number) => {
    this.logService.log('displayWIthIdLookup2', option, this.listData);
    return this.autoCompleteService.displayReferenceFromLookup(
      option,
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
        return Object.assign({}, val); // { uid: val.uid, val: val.val, name: val['name'] };
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
    return option;
  }

  onClosed() {
    /*this.logService.log(
      'current value',
      this.formGroup.controls[this.controlName],
      this.listControl.value
    );*/
    /*if (this.autoComplete.options.length > 1) {
      this.listControl.setValue(undefined);
      this.formGroup.controls[this.controlName].setValue(undefined);
    } else {
      if (this.selectedItem) {
        this.listControl.setValue(this.selectedItem);
        this.formGroup.controls[this.controlName].setValue(this.selectedItem);
      }
    }*/
  }
}
