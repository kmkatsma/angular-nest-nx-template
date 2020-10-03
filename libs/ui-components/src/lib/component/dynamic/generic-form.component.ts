import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  FormControlService,
  LinkedFields,
} from '../../forms/form-control.service';
import { ValidatorService } from '../../forms/validator.service';

@Component({
  selector: 'ocw-generic-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <mat-card [formGroup]="form">
    <mat-card-title>{{ title }}</mat-card-title>
    <div fxLayout="column">
      <div fxLayout="row wrap" fxLayoutGap="40px">
        <div *ngIf="formFields" fxLayoutGap="40px">
          <div *ngFor="let item of formFields" fxLayoutGap="40px">
            <ocw-linked-fields-list [item]="item" [formGroup]="form">
            </ocw-linked-fields-list>
          </div>
        </div>
      </div></div
  ></mat-card>`,
})
export class GenericFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() form: FormGroup;
  @Input() title: string;
  @Input() fieldsList: Array<LinkedFields>;

  ngUnsubscribe: Subject<void> = new Subject<void>();
  eventsRegistered = false;
  formFields: Array<LinkedFields>;

  constructor(
    private formControlService: FormControlService,
    private validatorService: ValidatorService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.registerEvents();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private registerEvents() {
    if (!this.form) {
      return;
    }
    if (this.eventsRegistered) {
      return;
    }
    if (!this.fieldsList) {
      return;
    }

    const fields = new Array<LinkedFields>();
    this.fieldsList.forEach((p) => {
      fields.push(
        this.formControlService.addYesNoLinkedFields(
          this.form,
          this.ngUnsubscribe,
          p.field,
          p.dependentFields
        )
      );
    });

    this.formFields = fields;
    this.eventsRegistered = true;
    this.validatorService.triggerFormFieldEnableState(this.form);
  }
}
