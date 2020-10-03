import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { LogService } from '@ocw/ui-core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppStoreService } from '@ocw/ui-core';
import {
  BaseAppStateEnum,
  TabMenuItem,
  UserInfoDocument,
} from '@ocw/shared-models';

@Component({
  selector: 'ocw-layout-toolbar-user',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div fxLayout="row">
      <div *ngIf="user" fxHide.lt-sm class="ocw-toolbar-text">
        {{ user.fullName }}
      </div>
      <div>
        <button
          mat-icon-button
          [matMenuTriggerFor]="userMenu"
          aria-label="Open basic menu"
        >
          <mat-icon class="vert-menu">more_vert</mat-icon>
        </button>

        <mat-menu #userMenu="matMenu" xPosition="before" yPosition="below">
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>Logout
          </button>
          <button mat-menu-item (click)="toggleTheme()">
            <mat-icon>swap_horiz</mat-icon>Toggle UI Theme
          </button>
        </mat-menu>
      </div>
    </div>
  `,
})
export class LayoutToolbarUserComponent implements OnInit, OnChanges {
  @Input() user: UserInfoDocument;
  @Input() menu: TabMenuItem[];
  @Output() logoutClicked = new EventEmitter<void>();

  isDarkMode: boolean;
  ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private appStoreService: AppStoreService,
    private logService: LogService
  ) {}

  ngOnInit() {
    this.appStoreService
      .AppState$(BaseAppStateEnum.IsDarkMode)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((p) => {
        this.isDarkMode = p.isDarkMode;
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.user) {
      this.logService.log('user changes', this.user);
    }
  }

  toggleTheme() {
    this.appStoreService.setState(
      { isDarkMode: !this.isDarkMode },
      BaseAppStateEnum.IsDarkMode
    );
  }

  logout() {
    this.logoutClicked.emit();
  }
}
