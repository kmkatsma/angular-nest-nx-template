import { Injectable } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { StatusStoreService } from '@ocw/ui-core';

export const EMAIL_REGEX: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export const SSN_REGEX: RegExp = /^\d{9}$/; // /^\d{3}-\d{2}-\d{4}$/;
export const PHONE_REGEX: RegExp = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
export const YES_NO_REGEX: RegExp = /Y|N|y|n/;
export const BIRTH_DATE_REGEX: RegExp = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
export const DATE_REGEX: RegExp = /(\d{4})-(\d{2})-(\d{2})/;
export const REASON_REGEX: RegExp = /D|d|N|n|W|w|U|u|C|c|I|i/;
export const DATE_MASK = [
  /[0-9]/,
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
];
export const YES_NO_MASK = [/[YyNn]/];
export const MMDDYYYYDateMask = [
  /[0-9]/,
  /\d/,
  '/',
  /\d/,
  /\d/,
  '/',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];
export const PHONE_MASK = [
  /[1-9]/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];
export const FEDERAL_ID_MASK = [
  /[0-9]/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

@Injectable({ providedIn: 'root' })
export class ValidatorService {
  // public emailFormControl = new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]);

  constructor(private statusService: StatusStoreService) {}

  static lengthIfNotEmpty = (num: number) => {
    return (control: AbstractControl) => {
      if (!control.value) {
        return undefined;
      }
      if (control.value.length < num) {
        return { error: 'minimum ' + num };
      }
      return undefined;
    };
  };

  static dateRequired = () => {
    return (control: AbstractControl) => {
      if (!control.value) {
        return undefined;
      }
      if (control.value <= 0) {
        return { error: 'minimum ' + 0 };
      }
      return undefined;
    };
  };

  publishMessage(message: string) {
    this.statusService.publishMessage(message);
  }

  publishError(message: string) {
    this.statusService.publishError(message);
  }

  createEmailControl(value: string): FormControl {
    return new FormControl(value || '', [Validators.pattern(EMAIL_REGEX)]);
  }

  createPhoneControl(value: string): FormControl {
    return new FormControl(value || '', Validators.pattern(PHONE_REGEX));
  }

  emailRegex(): RegExp {
    return EMAIL_REGEX;
  }

  ssnRegex(): RegExp {
    return SSN_REGEX;
  }

  yesNoRegex(): RegExp {
    return YES_NO_REGEX;
  }

  dateRegex(): RegExp {
    return DATE_REGEX;
  }

  birthDateRegex(): RegExp {
    return BIRTH_DATE_REGEX;
  }

  assessmentReasonRegex(): RegExp {
    return REASON_REGEX;
  }

  triggerFormValidation(form: FormGroup | FormArray, emitEvent = false) {
    Object.keys(form.controls).map((field) => {
      const control = form.get(field);
      //console.log('control', control);
      if (control instanceof FormControl) {
        control.markAsTouched();
        control.markAsDirty();
        control.updateValueAndValidity({
          onlySelf: false,
          emitEvent: emitEvent,
        });
      } else if (control instanceof FormGroup) {
        this.triggerFormValidation(control, emitEvent);
      }
    });
  }

  triggerFormFieldEnableState(form: FormGroup | FormArray) {
    Object.keys(form.controls).map((field) => {
      const control = form.get(field);
      //console.log('control', control);
      if (control instanceof FormControl) {
        control.markAsTouched();
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true, emitEvent: true });
      } else if (control instanceof FormGroup) {
        this.triggerFormValidation(control);
      }
    });
  }

  validateDateRange(dateStartKey: string, dateEndKey: string) {
    return (formGroup: FormGroup) => {
      const dateStart = formGroup.controls[dateStartKey];
      const dateEnd = formGroup.controls[dateEndKey];
      dateEnd.setErrors(null);
      if (dateEnd.value && dateEnd.value > 0) {
        console.log(
          'datestart & dateEnd.value',
          dateStart.value,
          dateEnd.value
        );
        if (new Date(dateEnd.value) < new Date(dateStart.value)) {
          return dateEnd.setErrors({
            notvalidateCloseDateGreatherThanOpenDate: true,
          });
        }
      }
    };
  }

  validateDateRequired(dateField: string) {
    return (group: FormGroup) => {
      const dateEnd = group.controls[dateField];
      if (!dateEnd.value || dateEnd.value <= 0) {
        return dateEnd.setErrors({ validateDateRequired: true });
      } else {
        return undefined;
      }
    };
  }

  validateCloseReason(dateEndKey: string, closeReasonKey: string) {
    return (group: FormGroup) => {
      const dateEnd = group.controls[dateEndKey];
      const closeReason = group.controls[closeReasonKey];
      closeReason.setErrors(null);
      if (dateEnd.value && dateEnd.value > 0 && !closeReason.value) {
        return closeReason.setErrors({ validateCloseReason: true });
      }
    };
  }

  validateLengthIfNotEmpty(length: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return undefined;
      }
      if (control.value.length < length) {
        return { error: 'minimum ' + length };
      }
      return undefined;
    };
  }
}
