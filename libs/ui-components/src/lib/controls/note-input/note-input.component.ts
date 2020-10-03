import {
  Component,
  OnInit,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import {
  EditNotesComponent,
  EditNotesResult,
} from './edit-notes/edit-notes.component';

@Component({
  selector: 'ocw-note-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field
      class=""
      [formGroup]="formGroup"
      [ngStyle]="style"
      [fxFlex]="fxFlex"
    >
      <input
        matInput
        [placeholder]="placeholder"
        [formControlName]="controlName"
        name="notes"
      />
      <button mat-icon-button matSuffix (click)="editNotes()">
        <mat-icon class="small-font">edit</mat-icon>
      </button>
    </mat-form-field>
  `,
})
export class NoteInputComponent implements OnInit {
  @Input() placeholder = 'Notes';
  @Input() required: boolean;
  @Input() formGroup: FormGroup;
  @Input() controlName: any;
  @Input() style: string;
  @Input() maxLength: number;
  @Input() fxFlex: number;
  @Output() notes: string;
  dialogRef: MatDialogRef<EditNotesComponent> | null;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  editNotes() {
    this.dialogRef = this.dialog.open(EditNotesComponent, {
      data: {
        notes: this.formGroup.controls[this.controlName].value,
        maxLength: this.maxLength,
      },
    });
    this.dialogRef.afterClosed().subscribe((result: EditNotesResult) => {
      this.notes = result.notes;
      if (this.notes) {
        console.log('notes value', this.notes);
        this.formGroup.controls[this.controlName].setValue(this.notes);
      }
      this.dialogRef = null;
    });
    this.formGroup.updateValueAndValidity();
  }
}
