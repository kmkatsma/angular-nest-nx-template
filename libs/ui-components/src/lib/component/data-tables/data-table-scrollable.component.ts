import { SelectionModel } from '@angular/cdk/collections';
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
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {
  BaseDocument,
  ColumnDataType,
  ColumnDefinition,
} from '@ocw/shared-models';
import { LogService } from '@ocw/ui-core';
import { Subject } from 'rxjs';
import { DataTablePrintService } from './data-table-print.service';
import { DataTableService } from './data-table.service';

@Component({
  selector: 'ocw-data-table-scrollable',
  templateUrl: './data-table-scrollable.component.html',
  styleUrls: ['./data-table-scrollable.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableScrollableComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() columns: ColumnDefinition[];
  @Input() checkbox: boolean;
  @Input() data: any[];
  @Input() filter = true;
  @Input() showPrint = false;
  @Input() hideFooter = false;
  @Input() showAddButton = false;
  @Input() length: number;
  @Input() heightOffset = 250;
  @Input() domainEntities: Map<number, BaseDocument>;
  @Output() itemSelected = new EventEmitter<any>();
  @Output() addClicked = new EventEmitter<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  private multiSelect = false;
  private emitChanges = true;
  searching = false;
  selection = new SelectionModel<any>(this.multiSelect, null, this.emitChanges);
  tableHeight: {};
  ColumnDataTypes = ColumnDataType;
  constructor(
    private readonly logService: LogService,
    private readonly dataTableService: DataTableService,
    private readonly dataTablePrintService: DataTablePrintService
  ) {
    this.logService.log('DataTableScrollableComponent.constructor:');
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.tableHeight = {
      'max-height': 'calc(100vh - ' + this.heightOffset + 'px)',
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    this.logService.log(
      'DataTableComponent ngOnChanges:',
      this.data,
      this.columns
    );
    this.selection.clear();

    if (changes.columns && this.columns) {
      this.displayedColumns = [];
      if (this.checkbox) {
        this.displayedColumns.push('checkbox');
      } else {
        this.displayedColumns.push('nocheckbox');
      }
      this.displayedColumns = this.displayedColumns.concat(
        this.columns.map((p) => p.cdkColumnDef)
      );
    }
    if ((changes.data || changes.columns) && this.data && this.columns) {
      this.dataSource = this.dataTableService.transformDataset(
        this.data,
        this.columns
      );
      this.dataSource.sort = this.sort;
      this.length = this.data.length;
    }
  }

  addItem() {
    this.addClicked.emit();
  }

  onRowClick(row: any) {
    this.logService.log('row clicked', row);
    this.itemSelected.emit(row);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  exportToExcel() {
    this.dataTablePrintService.exportToExcel(this.data, this.columns);
  }
}
