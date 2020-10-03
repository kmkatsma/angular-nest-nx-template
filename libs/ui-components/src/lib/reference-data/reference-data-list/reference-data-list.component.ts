import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ReferenceItem,
  BaseResourceEnum,
  ReferenceDataInfo,
} from '@ocw/shared-models';
import {
  AppStoreService,
  DomainStoreService,
  ResourceStoreService,
  LogService,
  StateUtil,
} from '@ocw/ui-core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseAppStateEnum } from '@ocw/shared-models';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ocw-reference-data-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-drawer-container style="height: 100%;">
      <mat-drawer-content style="height: 100%; padding: 1px;">
        <div style="height: 100%;" *ngIf="dataInfo">
          <mat-card [formGroup]="form" style="margin: 0px;">
            <ocw-card-title
              [titleText]="dataInfo.displayName"
              [iconName]="dataInfo.icon"
              [subTitleText]="dataInfo.description"
            ></ocw-card-title>
            <div fxLayout="row wrap" fxLayoutGap="48px">
              <div>
                <mat-checkbox formControlName="includeInactive"
                  >Include Inactive</mat-checkbox
                >
              </div>
            </div>
          </mat-card>
          <div style="margin-top: 8px;"></div>
          <ocw-data-table-scrollable
            *ngIf="!opened || !useRoute"
            [heightOffset]="300"
            [filter]="false"
            (itemSelected)="itemSelected($event)"
            (addClicked)="addItem()"
            [columns]="dataInfo.columns"
            [checkbox]="false"
            [data]="dataList"
            [filter]="true"
            [showAddButton]="dataInfo.allowAdd"
          ></ocw-data-table-scrollable>
          <ng-container *ngIf="opened && useRoute">
            <router-outlet></router-outlet>
          </ng-container>
        </div>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
})
export class ReferenceDataListComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() includeInactive: boolean;
  @Input() dataInfo: ReferenceDataInfo;
  @Input() data: any;
  @Input() useRoute = true;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  dataList: any[];
  form: FormGroup;
  opened = false;

  constructor(
    private logService: LogService,
    private router: Router,
    private route: ActivatedRoute,
    private appStateService: AppStoreService,
    private resourceService: ResourceStoreService,
    private domainStoreService: DomainStoreService,
    private formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
    //this.dataList2.push(new ReferenceItem(1, 'test'));
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

    this.form
      .get('includeInactive')
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val) => {
        this.includeInactive = val;
        this.populateDataList();
      });

    this.resourceService
      .ResourceSave$(BaseResourceEnum.ReferenceEntity)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val) => {
        console.log('ref entity saved opened', this.opened);
        if (this.opened) {
          this.appStateService.setState(
            { opened: false },
            BaseAppStateEnum.FormOpen
          );
        }
        this.domainStoreService.loadDomains(
          this.dataInfo.domainEnum,
          this.dataInfo.domainKeyEnum,
          this.dataInfo.getMessageType,
          {
            noCache: true,
          }
        );
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.logService.log(
      'ReferenceDataListComponent changes',
      this.data,
      this.dataInfo
    );
    if (changes.dataInfo && this.dataInfo) {
      this.logService.log(
        'ReferenceDataListComponent loading data',
        this.dataInfo.getMessageType
      );
    }
    if (changes.dataInfo && this.dataInfo && this.data) {
      this.logService.log(
        'ReferenceDataListComponent navigate',
        this.data,
        this.dataInfo.componentRoute
      );
      this.appStateService.setState(
        this.dataInfo.domainAttributeName,
        BaseAppStateEnum.ManageDataDomainEnum
      );
      if (this.dataInfo.componentRoute) {
        this.router.navigate([this.dataInfo.componentRoute], {
          relativeTo: this.route,
        });
      }
      this.appStateService.setState(
        StateUtil.cloneDeep(this.dataInfo),
        BaseAppStateEnum.ReferenceDataInfo
      );
      this.populateDataList();
    }
    if (changes['data'] && this.data && this.dataInfo) {
      this.logService.log('data has changed', this.data);
      this.populateDataList();
    } else if (changes['includeInactive'] && this.data) {
      this.logService.log('inactive has changed', this.data);
      this.populateDataList();
    }
  }

  ngOnDestroy() {
    this.appStateService.setState({ opened: false }, BaseAppStateEnum.FormOpen);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      includeInactive: [''],
    });
  }

  private populateDataList() {
    if (this.dataInfo.domainAttributeName) {
      console.log('populateDataList referenceData', this.data, this.dataInfo);
      if (this.data[this.dataInfo.domainAttributeName]) {
        this.dataList = StateUtil.cloneDeep(
          this.data[this.dataInfo.domainAttributeName]
        );
      } else {
        this.dataList = [];
      }
    } else {
      if (this.data) {
        this.dataList = StateUtil.cloneDeep(this.data);
      } else {
        this.dataList = [];
      }
    }
    if (!this.includeInactive) {
      this.dataList = this.dataList.filter((p) => p.isActive === true);
    }
  }

  private clearResource() {
    this.resourceService.clearResourceDataSlot(
      BaseResourceEnum.ReferenceEntity
    );
  }

  itemSelected($event: ReferenceItem) {
    if ($event) {
      console.log('event', $event);
      console.log('dataList', this.dataList);
      let item: ReferenceItem;
      const doc = $event as ReferenceItem;
      item = this.dataList.find((p) => p.uid === doc.uid);

      item = this.dataList.find((p) => p.id === doc.id);
      if (item['document']) {
        item = item['document'];
      }
      this.resourceService.newResource(BaseResourceEnum.ReferenceEntity, item);
      this.logService.log('item selected', $event, item);
      this.appStateService.setState(
        { opened: true },
        BaseAppStateEnum.FormOpen
      );
    }
  }

  addItem() {
    this.resourceService.newResource(
      BaseResourceEnum.ReferenceEntity,
      new ReferenceItem()
    );
    this.appStateService.setState({ opened: true }, BaseAppStateEnum.FormOpen);
  }
}
