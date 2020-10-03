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
  ComponentListConfig,
  ReferenceItem,
  ReferenceItemAttribute,
} from '@ocw/shared-models';
import { FormEvent, LogService } from '@ocw/ui-core';
import * as cuid from 'cuid';
import { ValidatorService } from '../../../forms/validator.service';
import { ReferenceDataService } from '../../../reference-data/reference-data.service';
import { ComponentListService } from './component-list.service';

@Component({
  selector: 'ocw-component-list2',
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
            <ocw-component-list-item2
              [selectedItem]="item"
              [config]="listConfig"
              [form]="getItemControl(i)"
              [itemIndex]="i"
              [showRemove]="true"
              (deleted)="removeItem($event)"
            >
            </ocw-component-list-item2>
          </div>
        </div>
        <button
          *ngIf="showAdd"
          mat-mini-fab
          color="primary"
          type="button"
          tooltip="Add Item"
          (click)="addItem()"
        >
          <mat-icon class="md-24">add</mat-icon>
        </button>
      </div>
    </ng-template>
  `,
})
export class ComponentList2Component implements OnChanges {
  @Input() listConfig: ComponentListConfig;
  @Input() dataList: ReferenceItem[];
  @Input() form: FormGroup;
  @Input() formArray: FormArray;
  @Input() showAdd = true;
  @Input() showRemove = true;
  @Input() wrapInCard = true;
  @Output() formEvent: EventEmitter<FormEvent<FormGroup>> = new EventEmitter();

  listPopulated = false;

  constructor(
    private logService: LogService,
    private validatorService: ValidatorService,
    private refDataService: ReferenceDataService,
    private cd: ChangeDetectorRef,
    private componentListService: ComponentListService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.logService.log('ComponentList2Component.ngOnChanges', changes);
    if (changes.dataList && this.dataList) {
      this.logService.log('listChanged:', this.dataList, this.form.controls);
      if (!this.listPopulated) {
        this.populateFormList();
      }
      this.listPopulated = true;
    }
    if (changes.form && this.form) {
      this.form.valueChanges.pipe().subscribe((val: string) => {
        this.logService.log('ComponentList2Component.valueChanges', val);
      });
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
    const itemForm: FormGroup = this.componentListService.createFormGroup(
      this.listConfig.listItemFields
    );
    console.log('itemForm', itemForm);
    itemForm.setParent(this.formArray);
    this.formArray.controls.push(itemForm);
    //this.logService.log('create control rate form array', this.form.controls);
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
    const newItem = CloneUtil.cloneDeep(this.listConfig.entityInstance);
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
