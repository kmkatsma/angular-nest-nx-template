import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BaseSearchResult,
  ColumnDefinition,
  TenantDocument,
} from '@ocw/shared-models';
import { DateService } from '@ocw/ui-core';
import { ValidatorService } from '@ocw/ui-components';
import { Subject } from 'rxjs';
import { TenantService } from './tenant.service';

@Component({
  selector: 'ocw-tenant-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <div style="margin: 8px">
        <ocw-data-table
          *ngIf="tenantColumns"
          [showAddButton]="true"
          [pageSize]="10"
          [filter]="true"
          (itemSelected)="handleItemSelected($event)"
          [columns]="tenantColumns"
          [checkbox]="false"
          [data]="tenantService.tenant$ | async"
          (addClicked)="addTenantClicked()"
        ></ocw-data-table>
      </div>
    </div>
  `,
})
export class TenantSearchComponent implements OnInit, OnChanges {
  @Input() loadTrigger: boolean;
  @Output() itemSelected = new EventEmitter<TenantDocument>();
  @Output() addClicked = new EventEmitter<void>();
  form: FormGroup;

  tenantColumns: ColumnDefinition[];

  ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    public dateService: DateService,
    public tenantService: TenantService,
    private validatorService: ValidatorService
  ) {
    this.createForms();
  }

  ngOnInit() {
    this.tenantService.search();
    this.tenantColumns = this.tenantService.getColumns();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.loadTrigger) {
      this.tenantService.search();
    }
  }

  createForms() {
    this.form = this.formBuilder.group({
      billingTypes: ['', Validators.required],
      searchType: 'Month',
    });
  }

  handleItemSelected(item: BaseSearchResult<TenantDocument>) {
    console.log('item', item);
    this.itemSelected.emit(item.document);
  }

  addTenantClicked() {
    this.addClicked.emit();
  }

  isValid(form: FormGroup): boolean {
    this.validatorService.triggerFormValidation(form);
    return form.valid;
  }
}
