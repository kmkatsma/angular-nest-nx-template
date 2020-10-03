import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { CloneUtil } from '@ocw/shared-core';
import {
  ReferenceItemAttribute,
  ReferenceDataInfo,
  ButtonType,
  ButtonConfig,
  BaseDocument,
} from '@ocw/shared-models';
import { FormEvent, LogService, IReferenceDataService } from '@ocw/ui-core';
import * as cuid from 'cuid';
import { ValidatorService } from '../../../forms/validator.service';
import { ReferenceDataService } from '../../../reference-data/reference-data.service';

@Component({
  selector: 'ocw-component-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card
      *ngIf="wrapInCard && form"
      style="margin-top: 8px; margin-left: 1px; margin-right: 1px"
    >
      <ng-container *ngTemplateOutlet="template"></ng-container>
    </mat-card>

    <div
      *ngIf="!wrapInCard && form"
      style="margin-top: 8px; margin-left: 1px; margin-right: 1px"
    >
      <div *ngTemplateOutlet="template"></div>
    </div>

    <ng-template #template>
      <div fxLayout="column">
        <div *ngIf="dataList">
          <div *ngFor="let item of dataList; let i = index">
            <ocw-component-list-item
              [dataEditService]="dataEditService"
              [form]="getItemControl(i)"
              [selectedItem]="item"
              [referenceDataInfo]="referenceDataInfo"
              [itemIndex]="i"
              [showRemove]="showRemove"
              (deleted)="removeItem($event)"
            ></ocw-component-list-item>
          </div>
        </div>
        <div style="margin-top:8px"></div>
        <button
          *ngIf="showAdd && addButtonConfig.buttonType === ButtonType.Fab"
          mat-mini-fab
          color="primary"
          type="button"
          tooltip="Add Item"
          (click)="addItem()"
        >
          <mat-icon class="md-24">add</mat-icon>
        </button>
        <button
          *ngIf="showAdd && addButtonConfig.buttonType === ButtonType.Raised"
          type="button"
          color="primary"
          mat-raised-button
          (click)="addItem()"
        >
          {{ addButtonConfig.buttonLabel }}
        </button>
      </div>
    </ng-template>
  `,
})
export class ComponentListComponent implements OnChanges {
  @Input() dataEditService: IReferenceDataService;
  @Input() referenceDataInfo: ReferenceDataInfo;
  @Input() dataListItem: any;
  @Input() createDataListFormCallback: any;
  @Input() dataList: BaseDocument[];
  @Input() form: FormGroup;
  @Input() formArray: FormArray;
  @Input() showAdd = true;
  @Input() showRemove = true;
  @Input() wrapInCard = true;
  @Input() addButtonConfig: ButtonConfig = {
    buttonType: ButtonType.Fab,
    buttonLabel: '',
  };
  @Output() formEvent: EventEmitter<FormEvent<FormGroup>> = new EventEmitter();

  ButtonType = ButtonType;
  listPopulated = false;

  constructor(
    private logService: LogService,
    private validatorService: ValidatorService,
    private refDataService: ReferenceDataService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList && this.dataList) {
      this.logService.log('listChanged:', this.dataList, this.form.controls);
      if (!this.listPopulated) {
        this.populateFormList();
      }
      this.listPopulated = true;
    }
    if (changes.dataEditService) {
      this.logService.log('dataEditService:', this.dataEditService);
    }
  }

  populateFormList() {
    this.logService.log('populateFormList', this.dataList);
    this.dataList.forEach((rate) => {
      if (!rate.id) {
        rate.id = cuid();
      }
      this.createControl();
    });
  }

  private createControl() {
    const itemForm: FormGroup = this.createDataListFormCallback();
    console.log('itemForm', itemForm);
    itemForm.setParent(this.formArray);
    this.formArray.controls.push(itemForm);
  }

  private removeControl(index: number) {
    this.formArray.controls.splice(index, 1);
    this.dataList.splice(index, 1);
  }

  removeItem(index: number) {
    this.logService.log('remove provider index', index);
    this.removeControl(index);
  }

  getItemControl(index: number): FormGroup {
    const rateArray = this.formArray;
    return rateArray.controls[index] as FormGroup;
  }

  addItem() {
    if (!this.isValid()) {
      this.validatorService.publishError('Please fix validation errors');
      return;
    }
    const newItem = CloneUtil.cloneDeep(this.dataListItem);
    newItem.uid =
      this.refDataService.maxId(this.dataList, ReferenceItemAttribute.uid) + 1;
    newItem.id = cuid();
    this.createControl();
    this.dataList.push(newItem);
    this.cd.markForCheck();
    console.log('dataList', this.dataList);
  }

  isValid(): boolean {
    this.validatorService.triggerFormValidation(this.form);
    return this.form.valid;
  }
}
