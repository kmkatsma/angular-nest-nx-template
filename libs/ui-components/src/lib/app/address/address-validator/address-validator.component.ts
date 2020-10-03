import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  Address,
  AddressMatch,
  BaseSearchEnum,
  AddressValidationMessages,
} from '@ocw/shared-models';
import { LogService } from '@ocw/ui-core';
import { Subject } from 'rxjs';
import { SearchStoreService } from '@ocw/ui-core';
import { FormEvent, FormEventType } from '@ocw/ui-core';

@Component({
  selector: 'ocw-address-validator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card *ngIf="form" [formGroup]="form" fxLayout="column">
      <ocw-card-title
        iconName="search"
        titleText="Address Find"
        subTitleText="Find Potential Matching Addresses"
      ></ocw-card-title>

      <div fxLayout="column">
        <mat-form-field fxFlex.gt-sm="50" fxFlex.lt-md="100">
          <input
            matInput
            placeholder="Enter Address (e.g. 123 Main St, Northfield)"
            formControlName="address"
            maxlength="50"
            spellcheck="false"
            autocomplete="off"
          />
        </mat-form-field>

        <div *ngIf="address" fxFlex.gt-sm="50" fxFlex.lt-md="100">
          Selected Address: {{ address.address1 }}, {{ address.city }},
          {{ address.state }}
        </div>
        <mat-card
          *ngIf="addressMatches && !address"
          fxFlex.gt-sm="50"
          fxFlex.lt-md="100"
        >
          <mat-list
            color="warn"
            style="margin: 8px;"
            *ngIf="addressMatches.length > 0"
          >
            <mat-list-item> <div>Matching Addresses</div> </mat-list-item>
            <mat-divider inset="true"></mat-divider>
            <mat-list-item
              style="cursor: pointer;"
              class="ocw-clickable-item"
              (click)="addressPicked(match.placeId)"
              *ngFor="let match of addressMatches"
            >
              <div (click)="addressPicked(match.placeId)">
                {{ match.formattedAddress }}
              </div>
              <mat-divider inset="true"></mat-divider>
            </mat-list-item>
          </mat-list>
        </mat-card>
      </div>
      <div style="margin-top: 8px;" fxLayout="row">
        <button
          mat-raised-button
          color="primary"
          (click)="findAddressMatches()"
        >
          FIND MATCHES
        </button>
      </div>
    </mat-card>
  `,
})
export class AddressValidatorComponent implements OnDestroy, OnChanges {
  @Input() addressMatches: AddressMatch[];
  @Input() address: Address;
  @Input() form: FormGroup;
  @Output() formEvent: EventEmitter<FormEvent<boolean>> = new EventEmitter();
  @Output() addressEvent: EventEmitter<FormEvent<Address>> = new EventEmitter();

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private logService: LogService,
    private searchService: SearchStoreService
  ) {}

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['address'] && this.address) {
      this.addressEvent.emit(new FormEvent(this.address, null, null));
    }
    if (this.form && changes.form) {
      this.address = undefined;
    }
  }

  addressPicked(placeId: string) {
    this.searchService.processMessage(
      placeId,
      BaseSearchEnum.AddressGet,
      AddressValidationMessages.Get
    );
  }

  findAddressMatches() {
    this.address = undefined;
    const address = this.form.controls['address'].value;
    this.searchService.processMessage(
      address,
      BaseSearchEnum.AddressMatch,
      AddressValidationMessages.Match
    );
  }

  cancel() {
    this.formEvent.emit(new FormEvent(false, null, FormEventType.Cancel));
  }
}
