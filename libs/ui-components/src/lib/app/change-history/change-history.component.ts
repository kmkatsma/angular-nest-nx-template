import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CloneUtil } from '@ocw/shared-core';
import {
  AppStoreService,
  LogService,
  ResourceStoreService,
  SearchStoreService,
} from '@ocw/ui-core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  changeColumns,
  Diff,
  changeDetailColumns,
  ChangeEntry,
} from './change-history.config';
import { ChangeHistoryService } from './change-history.service';
import {
  AuditEventMessages,
  AuditEventSearchRequest,
  AuditEventSearchRecord,
  AuditEventSearchRequestField,
  BaseSearchEnum,
  BaseAppStateEnum,
  BaseResourceEnum,
} from '@ocw/shared-models';

@Component({
  selector: 'ocw-change-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-drawer-container id="drawer-container" style="height:100%">
      <mat-drawer
        class="drawer"
        style="width:100%"
        [(opened)]="opened"
        position="end"
        mode="over"
      >
        <div style="margin:8px" *ngIf="opened === true">
          <mat-card *ngIf="opened">
            <ocw-card-title
              iconName="history"
              titleText="Change Details"
              subTitleText="List of all changes made during this update, currently in JSON format."
            ></ocw-card-title>
            <ocw-data-table
              [showAddButton]="false"
              [filter]="true"
              [columns]="changeDetailColumns"
              [checkbox]="false"
              [data]="changes"
            ></ocw-data-table>
          </mat-card>
          <button
            style="margin-top:8px"
            type="button"
            color="primary"
            mat-button
            (click)="close()"
          >
            CANCEL
          </button>
        </div>
      </mat-drawer>
      <div fxLayout="column" style="height:100%">
        <div>
          <mat-card>
            <ocw-card-title
              iconName="history"
              titleText="Change History"
              subTitleText="List of all changes made on Constituent Info pages.  Click row to see details."
            ></ocw-card-title>
            <ocw-data-table
              [showAddButton]="false"
              [filter]="false"
              (itemSelected)="itemSelected($event)"
              [columns]="changeColumns"
              [checkbox]="false"
              [data]="historyService.dataList$ | async"
              [transformData]="true"
            ></ocw-data-table>
          </mat-card>
        </div></div
    ></mat-drawer-container>
  `,
})
export class ChangeHistoryComponent implements OnInit, OnChanges, OnDestroy {
  @Input() objectId: string;
  @Input() tableName: string;
  @Input() fieldWidth = 250;

  changes: ChangeEntry[] = [];
  opened = false;
  AuditEventSearchRequestField = AuditEventSearchRequestField;
  changeColumns = changeColumns;
  changeDetailColumns = changeDetailColumns;
  selectedRecord: AuditEventSearchRecord;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private logService: LogService,
    private resourceService: ResourceStoreService,
    private appStateService: AppStoreService,
    private searchService: SearchStoreService,
    public historyService: ChangeHistoryService
  ) {}

  ngOnDestroy() {
    this.searchService.setSearchData([], BaseSearchEnum.ChangeHistory);
    this.appStateService.setState(
      { opened: false },
      BaseAppStateEnum.FormOpened
    );
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.appStateService
      .AppState$(BaseAppStateEnum.FormOpened)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val: { opened: boolean }) => {
        this.opened = val.opened;
      });
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.objectId || simpleChanges.tableName) {
      if (this.objectId && this.tableName) {
        this.search();
      }
    }
  }

  search() {
    const request = new AuditEventSearchRequest();
    request.objectId = this.objectId;
    request.tableName = this.tableName;
    request.buildDiff = true;
    this.logService.log('request', request);
    this.searchService.processMessage(
      request,
      BaseSearchEnum.ChangeHistory,
      AuditEventMessages.Query
    );
  }

  itemSelected(record: AuditEventSearchRecord) {
    this.logService.log('record', record);
    this.selectedRecord = record;
    this.changes = [];
    if (record.diff) {
      for (let i = 0; i < record.diff.length; i++) {
        const diffVal: Diff<any, any> = record.diff[i];
        const change = new ChangeEntry();
        change.type = diffVal.kind;
        change.details = JSON.stringify(diffVal, null, '  ');
        this.changes.push(change);
      }
      this.changes = CloneUtil.cloneDeep(this.changes);
    }
    this.resourceService.setResourceData(
      record.document,
      BaseResourceEnum.AuditEvent
    );
    this.logService.log('selected doc', record);
    this.appStateService.setState(
      { opened: true },
      BaseAppStateEnum.FormOpened
    );
  }

  close() {
    this.opened = false;
  }
}
