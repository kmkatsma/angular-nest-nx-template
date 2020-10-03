import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class EditNotesResult {
  constructor(public action: 'save' | 'cancel', public notes: string) {}
}

@Component({
  selector: 'ocw-edit-notes',
  templateUrl: './edit-notes.component.html',
  styleUrls: ['./edit-notes.component.css']
})
export class EditNotesComponent implements OnInit {
  @Input() required: boolean;
  @Input() formGroup: FormGroup;
  @Input() controlName: any;
  public originalNotes = '';
  public updatedNotes = '';
  public maxLength = 100;

  constructor(
    public dialogRef: MatDialogRef<EditNotesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data.notes !== undefined) {
      if (this.data.notes) {
        this.originalNotes = this.data.notes;
        this.updatedNotes = this.data.notes;
      }
    }
    if (this.data.maxLength > 0) {
      this.maxLength = this.data.maxLength;
    }
  }

  save() {
    const result = new EditNotesResult('save', this.updatedNotes);
    this.dialogRef.close(result);
  }

  cancel() {
    const result = new EditNotesResult('cancel', this.originalNotes);
    this.dialogRef.close(result);
  }
}
