import { NgStyle } from '@angular/common';
import {
  AfterViewInit,
  Component,
  forwardRef,
  Injector,
  Input,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroupDirective,
  NgControl,
  NgForm,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateUtil } from '@ocw/shared-core';

export class CustomFieldErrorMatcher implements ErrorStateMatcher {
  constructor(private customControl: FormControl, private errors: any) {}

  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return (
      this.customControl &&
      this.customControl.touched &&
      (this.customControl.invalid || this.errors)
    );
  }
}

@Component({
  selector: 'ocw-datepicker',
  template: `
    <div>
      <mat-form-field [ngStyle]="style">
        <input
          [disabled]="disabled"
          [ngStyle]="style"
          matInput
          [placeholder]="placeHolder"
          [matDatepicker]="datePicker"
          [(ngModel)]="selectedDate"
          spellcheck="false"
          [errorStateMatcher]="errorMatcher()"
          (input)="change($event)"
          (blur)="onTouched()"
          (dateChange)="matChange($event)"
        />
        <mat-datepicker-toggle
          matSuffix
          [for]="datePicker"
        ></mat-datepicker-toggle>
      </mat-form-field>
      <mat-datepicker #datePicker></mat-datepicker>
      <mat-error *ngIf="invalid && errorMessage">
        {{ errorMessage }}
      </mat-error>
    </div>
  `,
  styleUrls: ['./datepicker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
})
export class DatepickerComponent
  implements ControlValueAccessor, AfterViewInit {
  @Input() placeHolder: string;
  @Input() style: NgStyle;
  @Input() class: string;
  @Input() required = false;
  @Input() errorMessage: string;
  @Input() showCalculateFromAge = false;
  @Input() useLocalTs = false;
  @Input() errors: any = null;

  //invalid: boolean;
  selectedDate: Date;
  age: number;
  value: number;
  disabled: boolean;
  control: FormControl;

  readonly errorStateMatcher: ErrorStateMatcher = {
    isErrorState: (ctrl: FormControl) => ctrl && ctrl.invalid,
  };

  constructor(private injector: Injector) {
    //this.control.valueAccessor = this;
    this.value = undefined; // undefined; // 0;
  }

  ngAfterViewInit(): void {
    const ngControl: NgControl = this.injector.get(NgControl, null);
    if (ngControl) {
      setTimeout(() => {
        this.control = ngControl.control as FormControl;
      });
    }
  }

  /*constructor(private control: NgControl) {
    this.control.valueAccessor = this;
  }*/

  /*get errorState() {
    return this.control.errors !== null && !!this.control.touched;
  }*/

  public onChange(newVal: number) {
    console.log('datepicker onChange', newVal);
  }

  public get invalid(): boolean {
    if (this.required && (!this.value || this.value <= 0)) {
      return true;
    }
    //return false;
    return this.control ? this.control.invalid : false;
  }

  public get showError(): boolean {
    if (!this.control) {
      return false;
    }

    const { dirty, touched } = this.control;

    const showError = this.invalid ? dirty || touched : false;
    console.log('show error');
    return showError;
  }

  public onTouched(_?: any) {}

  public registerOnChange(fn: any): void {
    console.log('super register on change');
    this.onChange = fn;
  }
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  public setDisabledState?(isDisabled: boolean): void {
    console.log('disable basecontrol', isDisabled);
    this.disabled = isDisabled;
  }

  errorMatcher() {
    return new CustomFieldErrorMatcher(this.control, this.errors);
  }

  public writeValue(obj: number): void {
    console.log('writevalue', obj);
    this.value = obj;
    if (!Number.isNaN(obj)) {
      if (this.useLocalTs) {
        if (this.value > 0) {
          this.selectedDate = new Date(obj * 1000);
          console.log('selectedDate', obj, this.value, this.selectedDate);
        }
      } else {
        this.selectedDate = DateUtil.convertTStoGMTDate(obj);
      }
    }
    if (this.required && (!this.value || this.value <= 0)) {
      console.log('invalid date', this.required, this.value);
      //this.invalid = true;
    } else {
      console.log('valid date', this.required, this.value);
      //this.invalid = false;
    }
  }

  matChange(event: MatDatepickerInputEvent<Date>) {
    console.log('matChange', event.value);
    //if (event.value) {
    this.handleChange(event.value);
    //}
  }

  change(event: any) {
    console.log(
      'datepicker',
      this.value,
      event,
      DateUtil.isDate(event.target.value)
    );
    const value = event.target.value;
    //TODO: add date validation library
    if (value.length !== 10) {
      return;
    }
    this.handleChange(value);
  }

  handleChange(value: any) {
    if (value === null || value === undefined) {
      this.value = undefined;
    } else {
      const date = new Date(value);
      if (this.useLocalTs) {
        this.value = date.getTime() / 1000;
      } else {
        this.value = DateUtil.convertDateToGMTTS(date);
      }
    }
    console.log('vale', this.value);
    this.onChange(this.value);
    this.onTouched();
    this.writeValue(this.value);
  }
}
