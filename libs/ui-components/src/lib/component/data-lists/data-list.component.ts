import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReferenceItem, ReferenceDataInfo } from '@ocw/shared-models';
import {
  LogService,
  StateUtil,
  ResourceStoreService,
  FormEvent,
  FormEventType,
} from '@ocw/ui-core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ocw-data-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-drawer-container style="height:100%">
      <mat-drawer
        class="drawer"
        style="width:100%;z-index:100;"
        #sidenav
        role="region"
        position="end"
        mode="over"
        [opened]="opened"
      >
        <mat-drawer-container style="height:100%">
          <div fxLayout="column">
            <ocw-data-edit
              [referenceDataInfo]="dataInfo"
              [item]="selectedItem"
              [submitAction]="submitAction"
              (action)="onEditAction($event)"
            ></ocw-data-edit>
          </div>
        </mat-drawer-container>
      </mat-drawer>
      <mat-drawer-content style="height: 100%; padding:1px">
        <div style="height: 100%" *ngIf="dataInfo">
          <mat-card [formGroup]="form" style="margin:0px">
            <mat-card-title *ngIf="title">{{ title }}</mat-card-title>
            <ocw-card-title
              *ngIf="!title"
              [titleText]="dataInfo.displayName"
              [iconName]="dataInfo.icon"
              [subTitleText]="dataInfo.description"
            ></ocw-card-title>
            <div fxLayout="row wrap" fxLayoutGap="48px">
              <div *ngIf="showIncludeInactive">
                <mat-checkbox formControlName="includeInactive"
                  >Include Inactive</mat-checkbox
                >
              </div>
            </div>
          </mat-card>
          <ocw-data-table-scrollable
            [heightOffset]="300"
            (itemSelected)="itemSelected($event)"
            (addClicked)="addItem()"
            [columns]="dataInfo.columns"
            [checkbox]="false"
            [data]="dataList"
            [filter]="filter"
            [showAddButton]="dataInfo.allowAdd"
          ></ocw-data-table-scrollable>
        </div>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
})
export class DataListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() title: string;
  @Input() showIncludeInactive = true;
  @Input() includeInactive: boolean;
  @Input() dataInfo: ReferenceDataInfo;
  @Input() data: any[];
  @Input() useRoute = true;
  @Input() submitAction = true;
  @Input() filter = true;
  @Output() updates = new EventEmitter<any>();

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  dataList: any[];
  form: FormGroup;
  opened = false;
  selectedItem: any;
  eventsRegistered = false;
  showEdit = false;

  constructor(
    private logService: LogService,
    private formBuilder: FormBuilder,
    private resourceService: ResourceStoreService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.form
      .get('includeInactive')
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val) => {
        this.includeInactive = val;
        this.populateDataList();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.logService.log('DataListComponent changes', this.data, this.dataInfo);
    if (changes.dataInfo && this.dataInfo && this.data) {
      this.populateDataList();
    }
    if (changes.data && this.data && this.dataInfo) {
      this.logService.log('data has changed', this.data);
      this.populateDataList();
    } else if (changes.includeInactive && this.data) {
      this.logService.log('inactive has changed', this.data);
      this.populateDataList();
    }
    if (changes.dataInfo && this.dataInfo) {
      this.registerResourceEvent();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private registerResourceEvent() {
    if (this.eventsRegistered || !this.dataInfo.resourceEnum) {
      return;
    }

    this.resourceService
      .ResourceSave$(this.dataInfo.resourceEnum)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val) => {
        if (this.opened) {
          this.opened = false;
        }
      });
    this.eventsRegistered = true;
  }

  private createForm() {
    this.form = this.formBuilder.group({
      includeInactive: [''],
    });
  }

  private populateDataList() {
    this.dataList = this.getDataList();
    if (!this.includeInactive) {
      this.dataList = this.dataList.filter((p) => p.isActive === true);
    }
  }

  private getDataList() {
    return StateUtil.cloneDeep(this.data);
  }

  itemSelected($event: ReferenceItem) {
    if ($event) {
      console.log('event', $event);
      let item: ReferenceItem;
      const doc = $event as ReferenceItem;

      if (doc.uid) {
        item = this.dataList.find((p) => p.uid === doc.uid);
      }
      if (!item) {
        item = this.dataList.find((p) => p.id === doc.id);
      }
      if (item['document']) {
        item = item['document'];
      }
      this.logService.log('item selected', $event, item);
      this.selectedItem = item;
      this.opened = true;
    }
  }

  private updateItemSelected(item: ReferenceItem, list: any[]) {
    let index = list.findIndex((p) => p.uid === item.uid);
    if (index < 0) {
      index = list.findIndex((p) => p.id === item.id);
    }
    list.splice(index, 1, item);
    return this;
  }

  onEditAction(event: FormEvent<any>) {
    this.logService.log('onEditAction', event);
    if (event.eventType === FormEventType.Save) {
      const dataList = this.getDataList();
      this.updateItemSelected(event.data, dataList);
      this.updates.emit(dataList);
      this.logService.log('onEditAction emit', dataList);
    }
    this.opened = false;
  }

  addItem() {
    this.opened = true;
  }
}
