import { FormEventType, FormEvent } from '@ocw/ui-core';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'ocw-data-table-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card-title style="font-size: 16px; font-weight: 500">
      <div fxLayout="row" style="display: flex; justify-content: space-between">
        <div>
          <span style="display: inline-block; vertical-align: middle;">{{
            title
          }}</span>
        </div>
        <div *ngIf="print">
          <button
            style="margin-top: -10px"
            color="primary"
            matTooltip="Print"
            mat-icon-button
            (click)="printClicked()"
          >
            <mat-icon>print</mat-icon>
          </button>
        </div>
      </div>
    </mat-card-title>
    <div fxLayout="row" style="margin-bottom: -16px">
      <div style="width:100%" fxLayout="row wrap" fxLayoutAlign="space-between">
        <button
          matTooltip="Add Entry"
          mat-mini-fab
          color="primary"
          type="button"
          (click)="addClicked()"
        >
          <mat-icon class="md-24">add</mat-icon>
        </button>
        <button
          *ngIf="includeAction"
          style="margin-left: 16px"
          [matTooltip]="actionTooltip"
          mat-mini-fab
          color="accent"
          type="button"
          (click)="addClicked()"
        >
          <mat-icon class="md-24">{{ actionIcon }}</mat-icon>
        </button>
      </div>
    </div>
  `,
})
export class DataTableHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() print = false;
  @Input() includeAction = false;
  @Input() actionTooltip: string;
  @Input() actionIcon: string;
  @Output() addEvent: EventEmitter<FormEvent<any>> = new EventEmitter();
  @Output() printEvent: EventEmitter<FormEvent<any>> = new EventEmitter();
  @Output() actionEvent: EventEmitter<FormEvent<any>> = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  printClicked() {
    this.printEvent.emit(new FormEvent(null, null, FormEventType.Print));
  }

  addClicked() {
    this.addEvent.emit(new FormEvent(null, null, FormEventType.Add));
  }

  actionClicked() {
    this.actionEvent.emit(new FormEvent(null, null, FormEventType.Update));
  }
}
