import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddressReferenceData } from '@ocw/shared-models';
import { Subject } from 'rxjs';
import { LogService } from '@ocw/ui-core';
import { MatSelect } from '@angular/material/select';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControlService } from '../../../forms/form-control.service';

@Component({
  selector: 'ocw-township-selection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [formGroup]="form"
      *ngIf="form && addressDomains && showTownships"
      fxLayout="row"
    >
      <mat-form-field style="min-width: 300px" fxFlex>
        <mat-select
          placeholder="Townships"
          [formControlName]="controlName"
          multiple
          #townshipsSelect
        >
          <mat-select-trigger>
            <span>{{ selectedTownships }}</span>
          </mat-select-trigger>
          <mat-option
            *ngFor="let township of addressDomains.townships"
            [value]="township.uid"
            >{{ township.code }} - {{ township.val }}</mat-option
          >
        </mat-select>
      </mat-form-field>
      <mat-checkbox
        *ngIf="selectAllControlName"
        type="checkbox"
        id="selectAllTownships"
        [(value)]="allSelected"
        [formControlName]="selectAllControlName"
        (click)="selectAll(townshipsSelect)"
        style="margin-left:16px; min-width: 113px; padding-top:10px"
        >Select All</mat-checkbox
      >
      <mat-checkbox
        *ngIf="!selectAllControlName"
        type="checkbox"
        id="selectAllTownships"
        [(value)]="allSelected"
        (click)="selectAll(townshipsSelect)"
        style="margin-left:16px; min-width: 113px; padding-top:10px"
        >Select All</mat-checkbox
      >
    </div>
    <div *ngIf="dialogRef" style="margin-top: 8px" fxLayout="row">
      <div fxFlex></div>
      <button type="button" color="primary" mat-button (click)="cancel()">
        OK
      </button>
    </div>
  `,
})
export class TownshipSelectionComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() form: FormGroup;
  @Input() controlName = 'township';
  @Input() selectAllControlName: string;
  @Input() addressDomains: AddressReferenceData;
  @Input() showTownships = true;
  @Input() dialogRef: MatDialogRef<TownshipSelectionComponent>;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  selectedTownships: any;
  allSelected = false;

  constructor(
    public logService: LogService,
    public formService: FormControlService
  ) {}

  ngOnDestroy() {
    this.logService.debug('ngOnDestroy', this);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.formService.triggerActionOnChange(
      this.controlName,
      this.form,
      this.setTownships,
      this.ngUnsubscribe
    );
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (this.form && this.controlName) {
      this.setTownships();
    }
  }

  setTownships = () => {
    const values: string[] = this.form.controls[this.controlName].value;
    this.selectedTownships = this.formService.buildDescriptionList(
      values,
      this.addressDomains.townships,
      'uid',
      'val'
    );
  };

  selectAll(select: MatSelect) {
    this.formService.selectAllByValue(
      select,
      this.form,
      this.controlName,
      this.allSelected
    );
    this.allSelected = !this.allSelected;
  }

  cancel() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
