import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ColumnDataType, ColumnDefinition } from '@ocw/shared-models';
import { LogService } from '@ocw/ui-core';
import { DataTablePrintService } from './data-table-print.service';
import { DataTableAction } from './data-table.config';
import { DataTableService } from './data-table.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ocw-data-table',
  templateUrl: 'data-table.component.html',
  styleUrls: ['data-table.component.scss'],
})
export class DataTableComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() columns: ColumnDefinition[];
  @Input() checkbox: boolean;
  @Input() data: any[];
  @Input() filter: boolean;
  @Input() filterName = 'Filter';
  @Input() pageSize = 5;
  @Input() hideFooter = false;
  @Input() showAddButton = false;
  @Input() length: number;
  @Input() transformData = false;
  @Output() itemSelected = new EventEmitter<any>();
  @Output() actionTriggered = new EventEmitter<DataTableAction>();
  @Output() addClicked = new EventEmitter<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  private multiSelect = false;
  private emitChanges = true;
  selection = new SelectionModel<any>(this.multiSelect, null, this.emitChanges);
  pageEvent: PageEvent;
  pageSizeOptions: number[] = [5, 10, 15, 25];
  ColumnDataTypes = ColumnDataType;

  constructor(
    private logService: LogService,
    public dataTableService: DataTableService,
    public dataTablePrintService: DataTablePrintService
  ) {
    this.logService.debug('DataTableComponent.constructor:');
  }

  ngOnInit() {}

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.logService.debug(
      'DataTableComponent ngOnChanges:',
      this.data,
      this.columns,
      this.pageSize
    );
    this.selection.clear();

    if (changes['columns'] && this.columns) {
      this.displayedColumns = [];
      if (this.checkbox) {
        this.displayedColumns.push('checkbox');
      }
      this.displayedColumns = this.displayedColumns.concat(
        this.columns.map((p) => p.cdkColumnDef)
      );
    }
    if ((changes['data'] || changes.columns) && this.data && this.columns) {
      this.pageEvent = new PageEvent();

      if (!this.transformData) {
        this.dataSource = this.dataTableService.transformDataset(
          this.data,
          this.columns
        );
        this.dataSource.sort = this.sort;
        this.length = this.data.length;
        this.dataSource.paginator = this.paginator;
      } else {
        this.logService.debug('set data source', this.data);
        this.dataSource = new MatTableDataSource<any>(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.length = this.data.length;
      }
    }
  }

  onRowClick(row: any) {
    this.logService.log('row clicked', row);
    this.itemSelected.emit(row);
  }

  onButtonClick(row: any, actionName: string) {
    const tableAction = new DataTableAction();
    tableAction.data = row;
    tableAction.action = actionName;
    this.logService.log('button clicked', tableAction);
    this.actionTriggered.emit(tableAction);
  }

  addItem() {
    this.addClicked.emit();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  exportToExcel() {
    this.dataTablePrintService.exportToExcel(this.data, this.columns);
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }
}
