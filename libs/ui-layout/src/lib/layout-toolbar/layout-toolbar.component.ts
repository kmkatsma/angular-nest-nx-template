import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BaseAppStateEnum, UserInfoDocument } from '@ocw/shared-models';
import { AppStoreService, LogService } from '@ocw/ui-core';
import { Subject } from 'rxjs';
import { ToolbarService } from './toolbar.service';

@Component({
  selector: 'ocw-layout-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-toolbar style="position:fixed; z-index:1000" class="mat-elevation-z2">
      <div fxLayout="row" fxFlex>
        <div fxFlex="none" style="margin-right:10px;">
          <button mat-icon-button (click)="openNav()">
            <mat-icon>menu</mat-icon>
          </button>
        </div>
        <div fxHide fxShow.gt-xs fxFlex="none" class="ocw-toolbar-text">
          {{ title }}
        </div>
        <div fxHide fxShow.gt-xs></div>
        <div class="ocw-toolbar-text" fxFlex="none">{{ location }}</div>
        <div fxFlex></div>
        <ocw-layout-toolbar-user [user]="user"></ocw-layout-toolbar-user>
      </div>
    </mat-toolbar>
  `,
})
export class LayoutToolbarComponent implements OnInit {
  @Input() title: string;
  @Input() user: UserInfoDocument;
  @Input() location: string;
  @Input() secondaryLocation: string;

  ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private appStoreService: AppStoreService,
    private logService: LogService
  ) {}

  ngOnInit() {}

  openNav() {
    this.logService.log('Nav toggled');
    const sideNavState = { isOpen: true };
    this.appStoreService.setState(sideNavState, BaseAppStateEnum.SideNavOpened);
  }
}
