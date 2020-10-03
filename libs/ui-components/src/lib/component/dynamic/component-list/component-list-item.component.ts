import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import {
  ReferenceAttributeType,
  ReferenceDataInfo,
  ReferenceItem,
  ReferenceItemAttribute,
  ReferenceValueAttribute,
} from '@ocw/shared-models';
import {
  DomainStoreService,
  IReferenceDataService,
  LogService,
  ReferenceDataUtil,
} from '@ocw/ui-core';
import { Subject } from 'rxjs';

@Component({
  selector: 'ocw-component-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="form" [formGroup]="form" style="margin-top: 8px;">
      <div fxLayout="row wrap" fxLayoutGap="48px">
        <div *ngIf="referenceDataInfo">
          <ocw-field-list
            [form]="form"
            [fields]="referenceDataInfo.customFields"
          ></ocw-field-list>
        </div>
        <div *ngIf="showRemove">
          <button mat-raised-button (click)="removeItem()">REMOVE</button>
        </div>
      </div>
      <ng-container
        *ngIf="referenceDataInfo && referenceDataInfo.childReference"
      >
        <mat-card-title>{{
          referenceDataInfo.childReference.displayName
        }}</mat-card-title>
        <ocw-component-list
          *ngIf="dataEditService && formArray"
          [referenceDataInfo]="referenceDataInfo.childReference"
          [dataListItem]="dataEditService.referenceItem"
          [createDataListFormCallback]="dataEditService.createDetailForm"
          [dataList]="dataEditService.dataList(selectedItem)"
          [form]="form"
          [formArray]="formArray"
          [showAdd]="true"
          [showRemove]="true"
        ></ocw-component-list>
      </ng-container>
    </div>
  `,
})
export class ComponentListItemComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() selectedItem: ReferenceItem;
  @Input() referenceDataInfo: ReferenceDataInfo;
  @Input() dataEditService: IReferenceDataService;
  @Input() itemIndex: number;
  @Input() form: FormGroup;
  @Input() showRemove = true;
  @Output() deleted = new EventEmitter<number>();

  clone: ReferenceItem;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  ReferenceValueAttribute = ReferenceValueAttribute;
  ReferenceItemAttribute = ReferenceItemAttribute;
  ReferenceAttributeType = ReferenceAttributeType;
  ReferenceDataUtil = ReferenceDataUtil;
  formArray: FormArray;

  constructor(
    private logService: LogService,
    public domainService: DomainStoreService
  ) {
    //this.form = this.createForm();
  }

  ngOnInit() {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (this.referenceDataInfo) {
      this.logService.log('comp list item refdata', this.referenceDataInfo);
    }
    if (
      (simpleChanges.selectedItem || simpleChanges.form) &&
      this.selectedItem &&
      this.form
    ) {
      this.populateForm(this.selectedItem);
    }
    if (
      this.form &&
      (simpleChanges.form || simpleChanges.dataEditService) &&
      this.dataEditService
    ) {
      this.formArray = this.dataEditService.getFormArray(this.form);
    }
    this.logService.log('child lists formArray', this.formArray);
    this.logService.log('child lists dataEditService', this.dataEditService);
    this.logService.log('child lists form', this.form);
    this.logService.log(
      'child lists referenceDataInfo',
      this.referenceDataInfo
    );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  populateForm(item: ReferenceItem) {
    this.form.patchValue(Object.assign({}, item));
  }

  removeItem() {
    this.deleted.emit(this.itemIndex);
  }
}
