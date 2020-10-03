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
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BaseAppStateEnum,
  BaseResourceEnum,
  ReferenceDataInfo,
  ReferenceItem,
} from '@ocw/shared-models';
import {
  AppStoreService,
  LogService,
  ResourceStoreService,
  SearchStoreService,
  StateUtil,
} from '@ocw/ui-core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ocw-document-list',
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
        opened="false"
      >
      </mat-drawer>
      <mat-drawer-content style="height: 100%; padding:1px">
        <div style="height: 100%" *ngIf="dataInfo">
          <mat-card style="margin:0px">
            <mat-card-title *ngIf="title">{{ title }}</mat-card-title>
            <ocw-card-title
              *ngIf="!title"
              [titleText]="dataInfo.displayName"
              [iconName]="dataInfo.icon"
              [subTitleText]="dataInfo.description"
            ></ocw-card-title>
          </mat-card>
          <div style="margin-top: 8px;"></div>
          <ocw-data-table-scrollable
            *ngIf="!opened"
            [heightOffset]="300"
            (itemSelected)="itemSelected($event)"
            (addClicked)="addItem()"
            [columns]="dataInfo.columns"
            [checkbox]="false"
            [data]="dataList"
            [filter]="filter"
            [showAddButton]="dataInfo.allowAdd"
          ></ocw-data-table-scrollable>
          <ng-container *ngIf="opened">
            <router-outlet></router-outlet>
          </ng-container>
        </div>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
})
export class DocumentListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() title: string;
  @Input() dataInfo: ReferenceDataInfo;
  @Input() data: any[];
  @Input() useRoute = true;
  @Input() submitAction = true;
  @Input() filter = true;
  @Output() updates = new EventEmitter<any>();

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  dataList: any[];
  opened = false;
  eventsRegistered = false;
  showEdit = false;

  constructor(
    private logService: LogService,
    private formBuilder: FormBuilder,
    private resourceService: ResourceStoreService,
    private router: Router,
    private route: ActivatedRoute,
    private appStateService: AppStoreService,
    private searchStoreService: SearchStoreService
  ) {}

  ngOnInit() {
    this.appStateService
      .AppState$(BaseAppStateEnum.FormOpen)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val) => {
        this.opened = val.opened;
        console.log('opened', val);
        if (!this.opened) {
          this.clearResource();
        }
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
      if (this.dataInfo.componentRoute) {
        this.router.navigate([this.dataInfo.componentRoute], {
          relativeTo: this.route,
        });
      }
      this.searchStoreService.processMessage(
        undefined,
        this.dataInfo.searchEnum,
        this.dataInfo.getMessageType
      );
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
        this.searchStoreService.processMessage(
          undefined,
          this.dataInfo.searchEnum,
          this.dataInfo.getMessageType
        );
      });
    this.eventsRegistered = true;
  }

  private populateDataList() {
    this.dataList = this.getDataList();
  }

  private getDataList() {
    return StateUtil.cloneDeep(this.data);
  }

  private clearResource() {
    this.resourceService.clearResourceDataSlot(
      BaseResourceEnum.ReferenceEntity
    );
  }

  itemSelected($event: ReferenceItem) {
    if ($event) {
      console.log('event', $event);
      let item: ReferenceItem;
      const doc = $event as ReferenceItem;
      if (!item) {
        item = this.dataList.find((p) => p.id === doc.id);
      }
      if (item['document']) {
        item = item['document'];
      }
      this.logService.log('item selected', $event, item);
      this.resourceService.setResourceData(
        item,
        BaseResourceEnum.ReferenceEntity
      );
      this.opened = true;
    }
  }

  addItem() {
    this.resourceService.newResource(
      BaseResourceEnum.ReferenceEntity,
      new ReferenceItem()
    );
    //this.appStateService.setState({ opened: true }, BaseAppStateEnum.FormOpen);
    this.opened = true;
  }
}
