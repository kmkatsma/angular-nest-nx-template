import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BaseResourceEnum,
  RequestAction,
  SaveUserInfoRequest,
  SystemReferenceData,
  UserInfoAttribute,
  UserInfoDocument,
  UserMessageTypes,
} from '@ocw/shared-models';
import {
  FormEvent,
  FormEventType,
  LogService,
  ResourceStoreService,
  StatusStoreService,
} from '@ocw/ui-core';
import { Subject } from 'rxjs';
import { FORM_MODE } from '../../../forms/enums';
import { FormControlService } from '../../../forms/form-control.service';
import {
  EMAIL_REGEX,
  ValidatorService,
} from '../../../forms/validator.service';

@Component({
  selector: 'ocw-user-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card style="margin:8px" [formGroup]="form">
      <ocw-card-title
        [titleText]="title"
        iconName="face"
        subTitleText="Add/Update User Information"
      ></ocw-card-title>
      <div fxLayout="column">
        <div>
          <mat-form-field fxFlex.gt-xs="50" fxFlex.lt-sm="100">
            <input
              matInput
              placeholder="Email Address"
              [formControlName]="UserInfoAttribute.emailAddress"
              maxlength="50"
              spellcheck="false"
              autocomplete="off"
            />
          </mat-form-field>
        </div>
        <div>
          <mat-form-field fxFlex.gt-xs="50" fxFlex.lt-sm="100">
            <input
              matInput
              placeholder="First Name"
              [formControlName]="UserInfoAttribute.firstName"
              maxlength="50"
              spellcheck="false"
              autocomplete="off"
            />
          </mat-form-field>
        </div>
        <div>
          <mat-form-field fxFlex.gt-xs="50" fxFlex.lt-sm="100">
            <input
              matInput
              placeholder="Last Name"
              [formControlName]="UserInfoAttribute.lastName"
              maxlength="50"
              spellcheck="false"
              autocomplete="off"
            />
          </mat-form-field>
        </div>

        <div *ngIf="systemReferenceData">
          <mat-form-field fxFlex.gt-xs="50" fxFlex.lt-sm="100">
            <mat-select
              placeholder="Roles"
              [formControlName]="UserInfoAttribute.roles"
              multiple
              #servicesSelect
            >
              <mat-option
                *ngFor="let role of systemReferenceData.roles"
                [value]="role.uid"
                >{{ role.val }}</mat-option
              >
            </mat-select>
          </mat-form-field>
        </div>
      </div>
    </mat-card>

    <div style="margin-left: 8px">
      <button
        [disabled]="!allowEdit"
        type="button"
        color="primary"
        mat-raised-button
        (click)="save()"
      >
        SAVE
      </button>
      <button type="button" color="primary" mat-button (click)="cancel()">
        CANCEL
      </button>
    </div>
  `,
})
export class UserEditComponent implements OnChanges, OnDestroy {
  @Input() allowEdit = true;
  @Input() user: UserInfoDocument;
  @Input() systemReferenceData: SystemReferenceData;
  @Input() mode: FORM_MODE;
  @Output() formEvent: EventEmitter<FormEvent<any>> = new EventEmitter();

  ngUnsubscribe: Subject<void> = new Subject<void>();
  title: string;
  form: FormGroup;
  UserInfoAttribute = UserInfoAttribute;
  eventsRegistered = false;

  constructor(
    private logService: LogService,
    private validatorService: ValidatorService,
    private formBuilder: FormBuilder,
    private formService: FormControlService,
    private statusService: StatusStoreService,
    private resourceService: ResourceStoreService // public domainService: DomainService
  ) {
    this.createForm();
  }

  createForm() {
    const validatorArr = [];

    this.form = this.formBuilder.group(
      {
        [UserInfoAttribute.firstName]: ['', Validators.required],
        [UserInfoAttribute.lastName]: ['', Validators.required],
        [UserInfoAttribute.emailAddress]: [
          '',
          [Validators.required, Validators.pattern(EMAIL_REGEX)],
        ],
        [UserInfoAttribute.locationId]: ['', [Validators.required]],
        [UserInfoAttribute.roles]: [''],
      },
      {
        validator: Validators.compose(validatorArr),
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    this.logService.debug('UserEditComponent.ngOnChanges');

    if (changes['user'] && this.user) {
      this.logService.log('user', this.user);
      this.populateForm();
    }
  }

  populateForm() {
    if (this.user) {
      this.title = this.formService.getFormTitle('User', this.mode);
      const patchObject: UserInfoDocument = Object.assign({}, this.user);
      this.logService.debug('patch object, form', this.user, this.form);
      this.form.patchValue(Object.assign({}, patchObject));
      this.logService.log('form values after patch', this.form.value);
    }
  }

  isValid(): boolean {
    this.validatorService.triggerFormValidation(this.form);
    return this.form.valid;
  }

  save(): void {
    if (!this.isValid()) {
      this.statusService.publishError('Please fix validation errors');
      return;
    }

    this.logService.log('Case before update:', this.user);
    const formModel = this.form.value;
    const cloneUser = Object.assign({}, this.user);
    const docToSave: UserInfoDocument = Object.assign({}, cloneUser, formModel);
    if (!docToSave.uid) {
      docToSave.uid = 0;
    }
    this.logService.log('docToSave after update:', docToSave);

    const request = new SaveUserInfoRequest();
    if (this.mode === FORM_MODE.UPDATE) {
      request.action = RequestAction.Update;
    } else {
      request.action = RequestAction.Create;
    }
    request.data = docToSave;
    this.resourceService.executeService({
      data: request.data,
      messageType: UserMessageTypes.Mutate,
      resourceEnum: BaseResourceEnum.User,
      action: request.action,
    });
  }

  cancel() {
    this.formEvent.emit(new FormEvent(null, null, FormEventType.Cancel));
  }

  ngOnDestroy() {
    this.logService.debug('Case ngOnDestroy');
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
