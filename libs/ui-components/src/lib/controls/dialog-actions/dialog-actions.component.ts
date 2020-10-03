import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormEvent, FormEventType } from '@ocw/ui-core';

@Component({
  selector: 'ocw-dialog-actions',
  templateUrl: './dialog-actions.component.html'
})
export class DialogActionsComponent implements OnInit {
  @Input() showSave: boolean;
  @Input() showPrint: boolean;
  @Input() showDelete: boolean;
  @Input() showCancel: boolean;
  @Output() buttonClicked: EventEmitter<FormEvent<any>> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  save() {
    this.buttonClicked.emit(
      new FormEvent(undefined, undefined, FormEventType.Save)
    );
  }

  print() {
    this.buttonClicked.emit(
      new FormEvent(undefined, undefined, FormEventType.Print)
    );
  }

  cancel() {
    this.buttonClicked.emit(
      new FormEvent(undefined, undefined, FormEventType.Cancel)
    );
  }

  delete() {
    this.buttonClicked.emit(
      new FormEvent(undefined, undefined, FormEventType.Delete)
    );
  }
}
