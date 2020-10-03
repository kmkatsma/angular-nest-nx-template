import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AddressAttribute } from '@ocw/shared-models';

@Injectable({
  providedIn: 'root',
})
export class AddressFormService {
  constructor(private formBuilder: FormBuilder) {}

  createAddressForm() {
    const addressForm = this.formBuilder.group({
      [AddressAttribute.address1]: ['', Validators.maxLength(80)],
      [AddressAttribute.address2]: ['', Validators.maxLength(80)],
      [AddressAttribute.city]: '',
      [AddressAttribute.postalCode]: '',
      [AddressAttribute.state]: '',
      [AddressAttribute.township]: '',
    });

    return addressForm;
  }

  createDisabledAddressForm() {
    const addressForm = this.formBuilder.group({
      [AddressAttribute.address1]: [
        { value: '', disabled: true },
        Validators.maxLength(80),
      ],
      [AddressAttribute.address2]: [
        { value: '', disabled: true },
        Validators.maxLength(80),
      ],
      [AddressAttribute.city]: [{ value: '', disabled: true }],
      [AddressAttribute.postalCode]: [{ value: '', disabled: true }],
      [AddressAttribute.state]: [{ value: '', disabled: true }],
      [AddressAttribute.township]: [{ value: '', disabled: true }],
    });

    return addressForm;
  }

  createAddressValidatorForm() {
    const form = this.formBuilder.group({
      ['address']: ['', Validators.required],
    });
    return form;
  }
}
