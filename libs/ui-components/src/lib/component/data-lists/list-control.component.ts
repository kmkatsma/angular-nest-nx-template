import { takeUntil } from 'rxjs/operators';
import {
  Component,
  Input,
  ViewChild,
  ChangeDetectionStrategy,
  OnChanges,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { ColumnDefinition, BaseDocument } from '@ocw/shared-models';
import {
  LogService,
  ResourceStoreService,
  SearchStoreService,
  StatusStoreService,
  EventsService,
} from '@ocw/ui-core';
import { Subject } from 'rxjs';
import { DataTableComponent } from '../data-tables/data-table.component';
import { MessageBoxService } from '../dialog/message-box.service';
import { ListSelectedEvent } from './list-control.models';

@Component({
  selector: 'ocw-list-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="font-size:20px; margin-bottom:5px">{{ title }}</div>
    <ocw-data-table
      [columns]="columns"
      [checkbox]="true"
      [data]="data"
    ></ocw-data-table>
    <div style="margin-top: 8px"></div>
    <div fxLayout="row wrap" fxLayoutAlign="space-between">
      <div>
        <button
          type="button"
          color="primary"
          mat-raised-button
          (click)="selectListItem()"
        >
          EDIT
        </button>
        <button
          type="button"
          color="primary"
          mat-button
          (click)="deleteListItem()"
        >
          DELETE
        </button>
      </div>
      <div>
        <button
          mat-mini-fab
          color="primary"
          type="button"
          (click)="addListItem()"
        >
          <mat-icon class="md-24">add</mat-icon>
        </button>
      </div>
    </div>
  `,
})
export class ListControlComponent implements OnChanges, OnDestroy {
  @Output() actionEmitter = new EventEmitter<ListSelectedEvent>();
  @ViewChild(DataTableComponent, { static: true })
  private tableComponent: DataTableComponent;
  @Input() data: Array<any>;
  @Input() listParentId: string;
  @Input() listEnum: number;
  @Input() resourceEnum: number;
  @Input() resourceName: string;
  @Input() columns: ColumnDefinition[];
  @Input() class: string;
  @Input() title: string;
  ngUnsubscribe: Subject<void> = new Subject<void>();
  subscribed: boolean;

  constructor(
    private logService: LogService,
    private storeService: ResourceStoreService,
    private searchService: SearchStoreService,
    private statusService: StatusStoreService,
    private eventService: EventsService,
    private messageBoxService: MessageBoxService
  ) {
    this.logService.log('ListControlComponent.constructor');
  }

  ngOnChanges() {
    if (!this.subscribed) {
      this.subscribed = true;
      this.storeService
        .ResourceChange$(this.resourceEnum)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((resourceStatus) => {
          this.logService.log('ListControl resource status', resourceStatus);
          //TODO: support message type
          //this.searchService.get(this.listParentId, this.listEnum);
        });
    }
  }

  ngOnDestroy() {
    this.logService.debug('ListControlComponent ngOnDestroy');
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  deleteListItem() {
    let selection = this.tableComponent.selection;
    if (!selection || !selection.selected[0]) {
      this.statusService.publishMessage(
        'Please select ' + this.resourceName + ' to delete'
      );
      return;
    }
    this.messageBoxService
      .confirm('', 'Delete ' + this.resourceName + '?', 'DELETE', 'CANCEL')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        if (res) {
          //TODO: must support message type
          /*this.storeService.deleteResource(
            selection.selected[0].id,
            this.resourceEnum
          );*/
        }
      });
  }

  selectListItem() {
    let selection = this.tableComponent.selection;
    this.logService.log('selection', selection);
    if (!selection || !selection.selected[0]) {
      this.statusService.publishMessage(
        'Please select' + this.resourceName + ' to edit'
      );
      return;
    }
    this.actionEmitter.emit(
      new ListSelectedEvent(this.listEnum, this.resourceEnum)
    );
    this.eventService.broadcast('ListSelected', this.listEnum);
    //TODO: add message type support
    this.storeService.executeGetRequest(
      selection.selected[0].id,
      this.resourceEnum,
      ''
    );
  }

  addListItem() {
    this.eventService.broadcast('ListSelected', this.listEnum);
    this.storeService.newResource(this.resourceEnum, new BaseDocument());
  }
}
