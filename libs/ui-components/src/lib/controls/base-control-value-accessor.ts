import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Self, Optional } from '@angular/core';

export class BaseControlValueAccessor<T> implements ControlValueAccessor {
  public disabled = false;
  /**
   * Call when value has changed programmatically
   */
  public value: T;
  public onChange(newVal: T) {
    console.log('super onChange');
  }
  constructor(@Self() @Optional() private control: NgControl) {
    this.control.valueAccessor = this;
  }

  /*constructor(private control: NgControl) {
    this.control.valueAccessor = this;
  }*/

  /*get errorState() {
    return this.control.errors !== null && !!this.control.touched;
  }*/

  public get invalid(): boolean {
    return this.control ? this.control.invalid : false;
  }

  public get showError(): boolean {
    if (!this.control) {
      return false;
    }

    const { dirty, touched } = this.control;

    return this.invalid ? dirty || touched : false;
  }

  public onTouched(_?: any) {}
  /**
   * Model -> View changes
   */
  public writeValue(obj: T): void {
    console.log('super write');
    this.value = obj;
  }
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
}
