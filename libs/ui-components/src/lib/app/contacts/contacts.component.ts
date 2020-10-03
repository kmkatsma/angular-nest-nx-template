import { takeUntil } from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import {
  ContactFieldValues,
  ContactFormat,
  ReferenceValueAttribute,
  PersonReferenceData,
  ContactType,
} from '@ocw/shared-models';
import { LogService } from '@ocw/ui-core';
import { AddContactComponent } from './add-contact/add-contact.component';
import { ContactsService } from './contacts.service';
import { EditNotesComponent, EditNotesResult } from '../../controls';

@Component({
  selector: 'ocw-contacts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card *ngIf="wrapInCard">
      <mat-card-title fxLayout="row">
        <div style="margin-right: 10px;">
          <mat-icon style="padding-top: 3px;" color="primary">phone</mat-icon>
        </div>
        <div>Contact Info</div>
      </mat-card-title>
      <ng-container *ngTemplateOutlet="contacts"></ng-container>
    </mat-card>

    <div *ngIf="!wrapInCard"><div *ngTemplateOutlet="contacts"></div></div>

    <ng-template #contacts>
      <div *ngIf="contactsForm && contactNotesForm" fxLayout="row">
        <div *ngIf="!loading" fxLayout="row wrap" fxLayoutAlign="space-between">
          <div
            fxLayoutGap="32px"
            *ngIf="contactsForm"
            [formGroup]="contactsForm"
          >
            <mat-form-field
              *ngFor="let contact of contactsList; let i = index"
              class=""
              [ngStyle]="fieldStyle"
            >
              <div *ngIf="contact.contactFormat == ContactFormatEnum.Phone">
                <input
                  matInput
                  type="tel"
                  mask="000-000-0000"
                  [showMaskTyped]="true"
                  placeholder="{{ contact.val }}"
                  [formControlName]="contact.fieldName"
                  name="{{ contact.fieldName }}"
                />
              </div>
              <div *ngIf="contact.contactFormat == ContactFormatEnum.Email">
                <input
                  matInput
                  placeholder="{{ contact.val }}"
                  [formControlName]="contact.fieldName"
                  name="{{ contact.fieldName }}"
                  spellcheck="false"
                />
              </div>
              <div *ngIf="contact.contactFormat == ContactFormatEnum.Url">
                <input
                  matInput
                  placeholder="{{ contact.val }}"
                  [formControlName]="contact.fieldName"
                  name="{{ contact.fieldName }}"
                  spellcheck="false"
                />
              </div>
              <mat-error
                *ngIf="
                  this.contactsForm.controls[contact.fieldName].hasError(
                    'pattern'
                  )
                "
              >
                Please use valid format
              </mat-error>
              <button
                mat-icon-button
                matSuffix
                (click)="editNotes(contact.fieldName)"
                matTooltip="Add/edit notes"
              >
                <mat-icon [ngClass]="getNotesClass(contact.fieldName)"
                  >insert_comment</mat-icon
                >
              </button>
            </mat-form-field>
          </div>
          <div style="padding-top: 8px; font-size: 12px;">
            <button
              color="primary"
              style="font-size: 12px; padding: 0px;"
              mat-button
              (click)="addContactType()"
            >
              <mat-icon style="font-size: 12px;">add</mat-icon>ADD CONTACT
            </button>
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class ContactsComponent implements OnDestroy, OnChanges {
  @Input() defaultContactTypes: Array<string>;
  @Input() domains: PersonReferenceData;
  @Input() contactFields: ContactFieldValues;
  @Input() contactsForm: FormGroup;
  @Input() contactNotesForm: FormGroup;
  @Input() wrapInCard = true;
  @Input() fieldStyle = {};
  @Input() showAddContact = true;

  public loading: boolean;
  public ngUnsubscribe: Subject<void> = new Subject<void>();
  public dialogRef: MatDialogRef<AddContactComponent>;
  public mask = '000-000-0000';
  public dialogEditNotesRef: MatDialogRef<EditNotesComponent> | null;
  public ContactFormatEnum = ContactFormat;
  contactsList: ContactType[] = [];

  constructor(
    private logService: LogService,
    private cd: ChangeDetectorRef,
    public contactsService: ContactsService,
    public dialog: MatDialog
  ) {
    this.loading = true;
    this.logService.log('ContactsComponent.constructor');
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnChanges() {
    this.logService.log(
      'Contacts NgOnChange',
      this.domains,
      this.contactsForm,
      this.contactNotesForm,
      this.contactFields,
      this.defaultContactTypes
    );
    if (
      this.domains &&
      this.contactFields &&
      this.contactsForm &&
      this.contactNotesForm
    ) {
      this.logService.log(
        'Contacts Domains Loaded!!!!',
        this.domains.contactTypes,
        this.contactFields
      );
      this.contactsList = this.contactsService.populateLocalContacts(
        this.contactsForm,
        this.domains,
        this.contactFields,
        this.defaultContactTypes
      );
      // this.patchValues();
      this.loading = false;
    }
    this.logService.log(
      'contact forms',
      this.contactNotesForm,
      this.contactsForm
    );
  }

  getNotesClass(fieldName: string): string {
    if (
      this.contactNotesForm.controls[fieldName] &&
      this.contactNotesForm.controls[fieldName].value
    ) {
      return 'accent-color';
    } else {
      return 'primary-color';
    }
  }

  fieldHasError(fieldName: string): boolean {
    this.logService.log('fieldName', fieldName);
    if (this.contactsForm.controls[fieldName].hasError('pattern')) {
      return true;
    } else {
      return false;
    }
  }

  addContactType() {
    this.contactsService.selectedContactTypes = this.contactsList.map(
      (p) => p.uid
    );
    this.contactsService.contactTypes = Object.assign(
      [],
      this.domains.contactTypes
    );
    this.dialogRef = this.dialog.open(AddContactComponent);

    this.dialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.logService.log('ContactsComponent: addContact result', result);
        if (result) {
          this.addNewContact(result);
        }
      });
  }

  addNewContact(placeHolder: string) {
    this.contactsList.push(
      this.domains.contactTypes.find(
        (p) => p[ReferenceValueAttribute.val] === placeHolder
      )
    );
    this.cd.markForCheck();
  }

  editNotes(fieldName: string) {
    const notes = this.contactNotesForm.controls[fieldName].value;
    this.dialogEditNotesRef = this.dialog.open(EditNotesComponent, {
      data: { notes: notes, maxLength: 100 },
    });
    this.dialogEditNotesRef
      .afterClosed()
      .subscribe((result: EditNotesResult) => {
        console.log('result', result);
        if (result && result.action) {
          this.contactNotesForm.controls[fieldName].setValue(result.notes);
          this.dialogEditNotesRef = null;
          this.cd.markForCheck();
          console.log(
            'ContactsComponent: contact notes',
            this.contactNotesForm.controls[fieldName].value
          );
        }
      });
  }
}
