import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChange,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NoteDocument, ObjectType, BaseSearchEnum } from '@ocw/shared-models';
import { SearchStoreService, LogService } from '@ocw/ui-core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FORM_MODE } from '../../forms/enums';
import { FormControlService } from '../../forms/form-control.service';
import { noteColumns } from './notes-list-config';
import { NotesService } from './notes.service';

@Component({
  selector: 'ocw-notes-list',
  template: `
    <mat-drawer-container style="height:100%">
      <mat-drawer
        class="drawer"
        style="width:100%;z-index:100; height: 99%"
        #sidenav
        role="region"
        position="end"
        mode="over"
        [(opened)]="opened"
      >
        <ocw-note-edit
          *ngIf="opened"
          [objectId]="objectId"
          [objectTypeId]="objectTypeId"
          [mode]="mode"
          [record]="selectedItem"
          (formEvent)="close()"
        ></ocw-note-edit>
      </mat-drawer>

      <mat-drawer-content fxLayout="column">
        <mat-card style="margin:2px">
          <ocw-card-title
            iconName="comment"
            titleText="Note Entry"
            subTitleText="Use to capture free-form notes related to Constituent"
          >
          </ocw-card-title>
          <div style="margin-top: 16px"></div>
          <div>
            <button
              style="margin-bottom: -25px"
              mat-mini-fab
              color="primary"
              type="button"
              (click)="addItem()"
            >
              <mat-icon class="md-24">add</mat-icon>
            </button>
            <ocw-data-table
              (itemSelected)="itemSelected($event)"
              [columns]="columns"
              [checkbox]="false"
              [data]="notesService.note$ | async"
            ></ocw-data-table>
          </div>
        </mat-card>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
})
export class NotesListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() objectId: string;
  @Input() objectTypeId: ObjectType;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  opened = false;
  columns = noteColumns;
  loaded = false;

  form: FormGroup;
  selectedItem: NoteDocument;
  mode: FORM_MODE.ADD | FORM_MODE.UPDATE;

  constructor(
    private logService: LogService,
    public formBuilder: FormBuilder,
    public formService: FormControlService,
    public notesService: NotesService,
    public searchService: SearchStoreService
  ) {
    this.createForm();
  }

  createForm() {}

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.objectId && this.objectTypeId && !this.loaded) {
      this.notesService.searchNotes(this.objectId, this.objectTypeId);
      this.loaded = true;
    }
  }

  ngOnInit() {
    this.notesService.noteUpdate$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.opened = false;
        this.notesService.searchNotes(this.objectId, this.objectTypeId);
      });
  }

  addItem() {
    this.logService.log('opened', this.opened);
    this.opened = true;
    this.mode = FORM_MODE.ADD;
    this.selectedItem = new NoteDocument();
  }

  itemSelected(selectedItem: NoteDocument) {
    this.logService.log('opened', this.opened);
    this.opened = true;
    this.mode = FORM_MODE.UPDATE;
    this.selectedItem = selectedItem;
  }

  close() {
    this.opened = false;
  }

  ngOnDestroy() {
    this.searchService.setSearchData([], BaseSearchEnum.Notes);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
