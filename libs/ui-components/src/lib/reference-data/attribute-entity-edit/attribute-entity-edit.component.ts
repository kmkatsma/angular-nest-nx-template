import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReferenceEntityEditBaseComponent } from '../reference-entity-edit-base/reference-entity-edit-base.component';
import {
  ReferenceValueAttribute,
  ReferenceItemAttribute,
} from '@ocw/shared-models';
import { LogService } from '@ocw/ui-core';
import {
  AppStoreService,
  ResourceStoreService,
  StatusStoreService,
} from '@ocw/ui-core';
import { ReferenceDataService } from '../reference-data.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidatorService } from '../../forms/validator.service';

@Component({
  selector: 'ocw-attribute-entity-edit',
  template: `<mat-card>
      <mat-card-title> {{ title }} </mat-card-title>

      <form [formGroup]="form">
        <div fxLayout="row wrap" fxLayoutGap="48px">
          <div>
            <mat-form-field style="min-width: 180px;">
              <input
                matInput
                placeholder="Short Name"
                [formControlName]="ReferenceItemAttribute.val"
                maxlength="50"
                spellcheck="false"
                autocomplete="off"
              />
            </mat-form-field>
          </div>
          <div>
            <mat-form-field style="min-width: 180px;">
              <input
                matInput
                placeholder="Long Name"
                [formControlName]="ReferenceItemAttribute.name"
                maxlength="50"
                spellcheck="false"
                autocomplete="off"
              />
            </mat-form-field>
          </div>
        </div>

        <div fxLayout="row wrap" fxLayoutGap="48px"></div>
      </form>
    </mat-card>

    <div style="margin-left: 0px; margin-top: 8px">
      <button type="button" color="primary" mat-raised-button (click)="save()">
        SAVE
      </button>
      <button type="button" color="primary" mat-button (click)="cancel()">
        CANCEL
      </button>
    </div> `,
})
export class AttributeEntityEditComponent
  extends ReferenceEntityEditBaseComponent
  implements OnInit, OnDestroy {
  ReferenceValueAttribute = ReferenceValueAttribute;

  constructor(
    logService: LogService,
    appStateService: AppStoreService,
    referenceDataService: ReferenceDataService,
    resourceService: ResourceStoreService,
    validatorService: ValidatorService,
    statusService: StatusStoreService,
    private formBuilder: FormBuilder
  ) {
    super(
      logService,
      appStateService,
      resourceService,
      referenceDataService,
      statusService,
      validatorService
    );
    this.form = this.createForm();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  createForm() {
    const form = this.formBuilder.group({
      [ReferenceValueAttribute.val]: ['', Validators.required],
      providerServiceType: ['', Validators.required],
      [ReferenceItemAttribute.isActive]: '',
    });
    return form;
  }
}
