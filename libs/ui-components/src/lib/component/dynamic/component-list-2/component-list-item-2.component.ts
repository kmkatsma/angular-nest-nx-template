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
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComponentListConfig, ReferenceItem } from '@ocw/shared-models';
import { LogService } from '@ocw/ui-core';
import { Subject } from 'rxjs';

@Component({
  selector: 'ocw-component-list-item2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ocw-field-list
      *ngIf="config"
      [showRemove]="true"
      [updateForm]="false"
      [form]="form"
      [fields]="config.listItemFields"
      (removeItemClicked)="removeItem()"
    ></ocw-field-list>
  `,
})
export class ComponentListItem2Component
  implements OnInit, OnChanges, OnDestroy {
  @Input() selectedItem: ReferenceItem;
  @Input() config: ComponentListConfig;
  @Input() itemIndex: number;
  @Input() form: FormGroup;
  @Input() showRemove = true;
  @Output() deleted = new EventEmitter<number>();

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  //formArray: FormArray;

  constructor(private logService: LogService) {}

  ngOnInit() {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (this.config) {
      this.logService.log('comp list item refdata', this.config);
    }
    if (
      (simpleChanges.selectedItem || simpleChanges.form) &&
      this.selectedItem &&
      this.form
    ) {
      this.populateForm(this.selectedItem);
    }
    this.logService.log('ComponentListItem2.OnChanges', simpleChanges);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  populateForm(item: ReferenceItem) {
    this.form.patchValue(Object.assign({}, item));
  }

  removeItem() {
    this.deleted.emit(this.itemIndex);
  }
}
