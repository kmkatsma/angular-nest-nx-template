import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';

import { ContactsService } from '../contacts.service';
import { ReferenceValue } from '@ocw/shared-models';
import { LogService } from '@ocw/ui-core';
import { AutoCompleteService } from '../../../controls';

@Component({
  selector: 'ocw-add-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <form
    class="example-form"
    [formGroup]="contactTypeForm"
    novalidate
  >
    <mat-form-field class="" style="min-width: 300px">
      <input
        type="text"
        placeholder="Contact Type To Add"
        matInput
        [formControl]="contactTypeControl"
        [matAutocomplete]="autoContactType"
      />
    </mat-form-field>
    <mat-autocomplete #autoContactType="matAutocomplete">
      <mat-option
        *ngFor="let option of filteredContactTypes | async"
        [value]="option.val"
      >
        {{ option.val }}
      </mat-option>
    </mat-autocomplete>
    <div>
      <br />
    </div>
    <div>
      <button
        type="button"
        color="primary"
        mat-raised-button
        (click)="select()"
      >
        OK
      </button>
      <button type="button" color="primary" mat-button (click)="cancel()">
        CANCEL
      </button>
    </div>
  </form>`,
})
export class AddContactComponent implements OnInit {
  ngUnsubscribe: Subject<void> = new Subject<void>();
  filteredContactTypes: Observable<ReferenceValue[]>;
  contactTypeControl = new FormControl();
  contactTypeForm: FormGroup;

  constructor(
    private contactsService: ContactsService,
    private logService: LogService,
    private autoCompleteService: AutoCompleteService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddContactComponent>
  ) {
    this.createForm();
  }

  createForm() {
    this.contactTypeForm = this.formBuilder.group({
      contactType: ['', [Validators.required, Validators.maxLength(50)]],
    });
    this.logService.log('AddContact form:', this.contactTypeForm);
  }

  ngOnInit() {
    const availableContactTypes = Object.assign(
      this.contactsService.contactTypes
    );
    const contactTypeIds = this.contactsService.selectedContactTypes;
    this.logService.log('available contact types:', availableContactTypes);

    contactTypeIds.forEach((element) => {
      this.logService.log('element:' + element);
      const index = availableContactTypes.findIndex((p) => p.uid === element);
      if (index >= 0) {
        this.logService.log('index:' + index);
        availableContactTypes.splice(index, 1);
        this.logService.log('availableContactTypes:', availableContactTypes);
      }
    });

    if (!this.filteredContactTypes) {
      this.logService.log(
        'availableContactTypes mapped',
        availableContactTypes
      );

      this.filteredContactTypes = this.autoCompleteService.getListObservable(
        availableContactTypes,
        this.contactTypeControl
      );

      this.logService.log('filteredContactTypes loaded');
    }
    this.logService.log('contacttypes:', this.filteredContactTypes);
  }

  select(): void {
    if (this.contactTypeControl.value) {
      this.logService.log('selected value:', this.contactTypeControl.value);
      this.dialogRef.close(this.contactTypeControl.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
