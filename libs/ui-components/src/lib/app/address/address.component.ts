import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddressAttribute, AddressReferenceData } from '@ocw/shared-models';
import { LogService } from '@ocw/ui-core';

@Component({
  selector: 'ocw-address',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <mat-card *ngIf="wrapInCard && addressForm">
      <mat-card-title fxLayout="row">
        <div style="margin-right: 10px;">
          <mat-icon style="padding-top: 3px;" color="primary"
            >location_on</mat-icon
          >
        </div>
        <div>Primary Address</div>
      </mat-card-title>
      <ng-container *ngTemplateOutlet="address"></ng-container>
    </mat-card>

    <div *ngIf="!wrapInCard && addressForm">
      <div *ngTemplateOutlet="address"></div>
    </div>

    <ng-template #address>
      <div fxLayout="row" [formGroup]="addressForm">
        <div fxLayout="row wrap" fxLayoutGap="32px">
          <mat-form-field style="min-width: 250px;">
            <input
              style="min-width: 250px;"
              matInput
              placeholder="Address 1"
              formControlName="address1"
              maxlength="80"
              #address1
              autocomplete="off"
            />
            <mat-hint align="end" aria-live="polite"
              >{{ address1.value.length }} / 80</mat-hint
            >
          </mat-form-field>
          <mat-form-field style="min-width: 250px;">
            <input
              matInput
              placeholder="Address 2"
              formControlName="address2"
              maxlength="80"
              #address2
              autocomplete="off"
            />
            <mat-hint align="end" aria-live="polite"
              >{{ address2.value.length }} / 80</mat-hint
            >
          </mat-form-field>
          <div *ngIf="addressReferenceData">
            <ocw-autocomplete-value
              [style]="{ 'min-width.px': 250 }"
              placeHolder="Postal Code"
              [listData]="addressReferenceData.postalCodes"
              controlName="postalCode"
              [formGroup]="addressForm"
              [required]="false"
            ></ocw-autocomplete-value>
          </div>
          <div *ngIf="addressReferenceData">
            <ocw-autocomplete-value
              [style]="{ 'min-width.px': 250 }"
              placeHolder="City"
              [listData]="addressReferenceData.cities"
              controlName="city"
              [formGroup]="addressForm"
              [required]="false"
            ></ocw-autocomplete-value>
          </div>
          <div *ngIf="addressReferenceData && showTownship">
            <ocw-autocomplete-id
              [style]="{ 'min-width.px': 250 }"
              placeHolder="Township"
              [listData]="addressReferenceData.townships"
              controlName="township"
              [formGroup]="addressForm"
              [required]="false"
            ></ocw-autocomplete-id>
          </div>
          <div *ngIf="addressReferenceData">
            <ocw-autocomplete-value
              [style]="{ 'min-width.px': 250 }"
              placeHolder="State"
              [listData]="addressReferenceData.states"
              controlName="state"
              [formGroup]="addressForm"
              [required]="false"
            ></ocw-autocomplete-value>
          </div>
        </div>
      </div>
    </ng-template>`,
})
export class AddressComponent implements OnChanges {
  @Input() addressReferenceData: AddressReferenceData;
  @Input() addressForm: FormGroup;
  @Input() wrapInCard = true;
  @Input() fieldsToHide = new Array<string>();
  @Input() formLoaded: boolean;

  showTownship = true;

  constructor(private logService: LogService) {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    this.logService.log('address Changes', simpleChanges);
    if (this.fieldsToHide.length > 0) {
      if (this.fieldsToHide.includes(AddressAttribute.township)) {
        this.showTownship = false;
      }
    }
  }
}
