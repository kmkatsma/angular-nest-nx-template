import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestAction } from '@ocw/shared-models';
import {
  NoteDocument,
  NoteDocumentFields,
  SaveNoteRequest,
  ObjectType,
} from '@ocw/shared-models';
import { LogService, StateUtil } from '@ocw/ui-core';
import { Subject } from 'rxjs';
import { StatusStoreService } from '@ocw/ui-core';
import { FormEvent, FormEventType } from '@ocw/ui-core';
import { NotesService } from './notes.service';
import { FORM_MODE } from '../../forms/enums';
import { ValidatorService } from '../../forms/validator.service';

@Component({
  selector: 'ocw-note-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card style="margin:16px">
      <mat-card-title> {{ title }} </mat-card-title>
      <form class="example-form" [formGroup]="form" novalidate>
        <button mat-button style="height: 0; position: absolute;"></button>
        <div fxLayout="column">
          <div fxLayout="row wrap" flexFill fxLayoutGap="48px">
            <mat-form-field class="" fxFlex="100">
              <textarea
                #notes
                style="min-height:240px;"
                [formControlName]="NoteDocumentFields.notes"
                [attr.maxlength]="maxLength"
                matInput
                placeholder=""
                name="notes"
              ></textarea>
              <mat-hint align="end"
                >{{ notes.value.length }} / {{ maxLength }}</mat-hint
              >
            </mat-form-field>
          </div>
        </div>
        <ocw-audit-fields [document]="record"></ocw-audit-fields>
      </form>
    </mat-card>

    <div style="margin-left: 16px">
      <button type="button" color="primary" mat-raised-button (click)="save()">
        SAVE
      </button>
      <div style="margin:4px"></div>
      <button
        *ngIf="mode === FORM_MODE.UPDATE"
        type="button"
        color="primary"
        mat-raised-button
        (click)="delete()"
      >
        DELETE
      </button>
      <button type="button" color="primary" mat-button (click)="cancel()">
        CANCEL
      </button>
    </div>
  `,
})
export class NoteEditComponent implements OnInit, OnChanges, OnDestroy {
  @Input() objectId: string;
  @Input() objectTypeId: ObjectType;
  @Input() record: NoteDocument;
  @Input() mode: FORM_MODE;
  @Output() formEvent: EventEmitter<FormEvent<any>> = new EventEmitter();

  form: FormGroup;
  showAdd = false;
  showRemove = false;
  title = '';
  NoteDocumentFields = NoteDocumentFields;
  FORM_MODE = FORM_MODE;
  maxLength = 5000;
  ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private statusService: StatusStoreService,
    private logService: LogService,
    private validatorService: ValidatorService,
    private notesService: NotesService
  ) {
    this.createForm();
  }

  createForm() {
    const validatorArr = [];

    this.form = this.formBuilder.group(
      {
        [NoteDocumentFields.notes]: ['', Validators.required],
      },
      {
        validator: Validators.compose(validatorArr),
      }
    );
  }

  ngOnChanges() {
    if (this.mode === FORM_MODE.ADD) {
      this.showAdd = true;
      this.title = 'Add Note';
    }
    if (this.record && this.mode === FORM_MODE.UPDATE) {
      this.showRemove = true;
      this.populateForm();
      this.title = 'Edit Note';
    }
  }

  ngOnInit() {}

  populateForm() {
    if (this.record) {
      this.form.controls[NoteDocumentFields.notes].setValue(
        this.record[NoteDocumentFields.notes]
      );
    }
  }

  isValid(): boolean {
    this.validatorService.triggerFormValidation(this.form);
    return this.form.valid;
  }

  save(): void {
    if (this.isValid()) {
      this.logService.debug('Item before update:', this.record);
      const request = new SaveNoteRequest();
      if (this.record) {
        request.data = StateUtil.cloneDeep(this.record);
      }
      request.data.notes = this.form.controls[NoteDocumentFields.notes].value;
      if (this.mode === FORM_MODE.ADD) {
        request.action = RequestAction.Create;
        request.data.objectId = this.objectId;
        request.data.objectTypeId = this.objectTypeId;
      }
      if (this.mode === FORM_MODE.UPDATE) {
        request.action = RequestAction.Update;
      }
      this.notesService.saveNote(request);
    } else {
      this.statusService.publishError('Please fix validation errors');
    }
  }

  cancel() {
    this.formEvent.emit(new FormEvent(null, null, FormEventType.Cancel));
  }

  delete() {
    const request = new SaveNoteRequest();
    if (this.record) {
      request.data = StateUtil.cloneDeep(this.record);
    }
    request.data.notes = this.form.controls[NoteDocumentFields.notes].value;
    request.action = RequestAction.Delete;
    request.data.objectId = this.objectId;
    request.data.objectTypeId = this.objectTypeId;
    this.notesService.saveNote(request);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
