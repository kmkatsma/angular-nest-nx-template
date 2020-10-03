import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AuthService,
  FormEvent,
  LogService,
  FormEventType,
  PermissionItemType,
} from '@ocw/ui-core';
import { PermissionItem } from '@ocw/shared-models';

export enum ButtonType {
  Raised = 1,
  Flat = 2,
  Standard = 3,
  Icon = 4,
  Fab = 5,
  MiniFab = 6,
  Stroked = 7,
}

@Component({
  selector: 'ocw-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container [ngSwitch]="buttonType">
      <button
        *ngSwitchCase="ButtonType.MiniFab"
        [style]="style"
        mat-mini-fab
        [color]="color"
        (click)="triggerAction(actionType)"
        [matTooltip]="toolTip"
        [disabled]="disabled"
      >
        <mat-icon *ngIf="icon" [color]="iconColor">{{ icon }}</mat-icon>
      </button>
    </ng-container>
    <!--ng-container [ngSwitch]="buttonType">
      <button
        *ngSwitchDefault
        [style]="style"
        mat-button
        [color]="color"
        (click)="triggerAction(actionType)"
        [matTooltip]="toolTip"
        [disabled]="disabled"
      >
        <mat-icon *ngIf="icon" [color]="iconColor">{{ icon }}</mat-icon>
      </button>
      <button
        *ngSwitchCase="ButtonType.MiniFab"
        [style]="style"
        mat-mini-fab
        [color]="color"
        (click)="triggerAction(actionType)"
        [matTooltip]="toolTip"
        [disabled]="disabled"
      >
        <mat-icon *ngIf="icon" [color]="iconColor">{{ icon }}</mat-icon>
      </buton>
      <button
        *ngSwitchCase="ButtonType.Raised"
        [style]="style"
        mat-raised-button
        [color]="color"
        (click)="triggerAction(actionType)"
        [matTooltip]="toolTip"
        [disabled]="disabled"
      >
        <mat-icon *ngIf="icon" [color]="iconColor">{{ icon }}</mat-icon>
      </button>
      <button
        *ngSwitchCase="ButtonType.Flat"
        [style]="style"
        mat-flat-button
        [color]="color"
        (click)="triggerAction(actionType)"
        [matTooltip]="toolTip"
        [disabled]="disabled"
      >
        <mat-icon *ngIf="icon" [color]="iconColor">{{ icon }}</mat-icon>
      </button>
      <button
        *ngSwitchCase="ButtonType.Icon"
        [style]="style"
        mat-icon-button
        [color]="color"
        (click)="triggerAction(actionType)"
        [matTooltip]="toolTip"
        [disabled]="disabled"
      >
        <mat-icon *ngIf="icon" [color]="iconColor">{{ icon }}</mat-icon>
      </button>
      <button
        *ngSwitchCase="ButtonType.Stroked"
        [style]="style"
        mat-stroked-button
        [color]="color"
        (click)="triggerAction(actionType)"
        [matTooltip]="toolTip"
        [disabled]="disabled"
      >
        <mat-icon *ngIf="icon" [color]="iconColor">{{ icon }}</mat-icon>
      </button>
    </ng-container-->
  `,
})
export class ButtonComponent implements OnChanges {
  @Input() disabled = false;
  @Input() buttonType = ButtonType.Raised;
  @Input() actionType: number;
  @Input() permission: number;
  @Input() permissions: PermissionItem[];
  @Input() permissionMissingTooltip: string;
  @Input() toolTip: string;
  @Input() color = 'primary';
  @Input() style: any;
  @Input() icon: string;
  @Input() iconColor = 'accent';
  @Input() resourceEnum = 0;
  @Input() eventType: FormEventType;
  @Output() clicked: EventEmitter<FormEvent<number>> = new EventEmitter();

  ButtonType = ButtonType;

  constructor(
    private authService: AuthService,
    private logService: LogService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.permission || changes.permissions) {
      if (this.permissions && this.permission) {
        if (this.authService.hasPermission(this.permission, this.permissions)) {
          this.disabled = false;
          this.toolTip = this.toolTip;
        } else {
          this.disabled = true;
          this.toolTip = this.permissionMissingTooltip;
        }
        console.log(
          'button component has permissions checked',
          this.permission,
          this.permissions
        );
      }
    }
  }

  triggerAction(actionType: number) {
    this.clicked.emit(
      new FormEvent(actionType, this.resourceEnum, this.eventType)
    );
  }
}
