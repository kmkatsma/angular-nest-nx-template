import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CloneUtil } from '@ocw/shared-core';
import {
  ReferenceItem,
  ReferenceValue,
  ReferenceValueAttribute,
} from '@ocw/shared-models';
import { FormEvent, FormEventType, LogService } from '@ocw/ui-core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AutoCompleteService } from './auto-complete.service';

@Component({
  selector: 'ocw-autocomplete-id',
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
      [displayWith]="displayWithIdLookup2"
      (closed)="onClosed()"
      (optionSelected)="optionSelect($event)"
    >
      <mat-option
        *ngFor="let option of filteredItem$ | async"
        [value]="getValue(option)"
      >
        {{ displayWithIdLookup(option) }}
      </mat-option>
    </mat-autocomplete>
    <mat-error *ngIf="errorMessage && formGroup.controls[controlName].invalid">
      {{ errorMessage }}
    </mat-error>
    <div *ngIf="dialogRef" fxLayout="row">
      <div fxFlex></div>
      <button type="button" color="primary" mat-button (click)="close()">
        OK
      </button>
    </div>
  `,
})
export class AutocompleteIdComponent implements OnChanges {
  @Input() placeHolder: string;
  @Input() listData: ReferenceItem[];
  @Input() required = false;
  @Input() formGroup: FormGroup;
  @Input() controlName: any;
  @Input() style: any;
  @Input() errorMessage: string;
  @Input() actionTrigger: boolean;
  @Input() addAny = false;
  @Input() valueField = 'uid';
  @Input() dialogRef: MatDialogRef<AutocompleteIdComponent>;
  @Output() optionSelected: EventEmitter<FormEvent<any>> = new EventEmitter();

  listControl: FormControl;
  filteredItem$: Observable<ReferenceValue[]>;
  filteredItems: ReferenceValue[];
  selectedItem: ReferenceValue;

  constructor(
    private autoCompleteService: AutoCompleteService,
    private logService: LogService
  ) {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['actionTrigger']) {
      console.log('trigger');
    }
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
    if (simpleChanges['listData'] && this.listData) {
      this.listData = CloneUtil.cloneDeep(this.listData);
      if (this.addAny) {
        this.listData.push(new ReferenceItem(-1, 'All'));
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
    return this.autoCompleteService.displayReferenceFromLookupProperty(
      option[this.valueField],
      this.valueField,
      this.listData
    );
  };

  displayWithIdLookup2 = (option: number) => {
    return this.autoCompleteService.displayReferenceFromLookupProperty(
      option,
      this.valueField,
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
    let options = [];
    if (isNaN(name as any)) {
      options = this.listData.filter(
        (option) =>
          option[ReferenceValueAttribute.val]
            .toString()
            .toLowerCase()
            .indexOf(filterValue) === 0
      );
    } else {
      options = this.listData.filter(
        (option) => option[ReferenceValueAttribute.uid] === Number(filterValue)
      );
    }
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

  getValue(option: ReferenceItem) {
    if (option.uid) {
      return option.uid;
    }
    return option.id;
  }

  onClosed() {
    const value = this.formGroup.controls[this.controlName].value;
    if (isNaN(value)) {
      this.formGroup.controls[this.controlName].setValue(undefined);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
