import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from '@ocw/ui-core';
import { MenuMode } from '../layout-sidenav/layout-sidenav.component';
import { TabMenuItem, UserInfoDocument } from '@ocw/shared-models';

@Component({
  selector: 'ocw-layout-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ocw-side-menu" [ngClass]="iconClass" fxLayout="column">
      <mat-accordion
        style="height: 100%"
        hideToggle="true"
        fxFlexFill
        style="padding-right:0px"
        [ngClass]="iconClass"
        class="primary-grey-back-color-light "
        displayMode="flat"
      >
        <mat-expansion-panel [ngClass]="iconClass" *ngFor="let item of menu">
          <mat-expansion-panel-header
            show
            style="padding:0px !important"
            collapsedHeight="50px"
            expandedHeight="50px"
            (afterExpand)="navigate(item.route)"
          >
            <div fxLayout="row" routerLinkActive="show-small-div">
              <div
                routerLinkActive="show-small-div"
                [routerLinkActiveOptions]="{ exact: false }"
              ></div>
              <ocw-layout-sidebar-button
                [iconClass]="iconClass"
                [width]="width"
                [item]="item"
              ></ocw-layout-sidebar-button>
            </div>
          </mat-expansion-panel-header>
          <div *ngIf="item.subMenu" fxLayout="column">
            <div *ngFor="let subItem of item.subMenu">
              <ocw-layout-sidebar-button
                [iconClass]="iconClass"
                [width]="width"
                [item]="subItem"
              ></ocw-layout-sidebar-button>
            </div>
          </div>
        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `,
  styles: [
    `
      .show-small-div {
        width: 2px;
        background-color: greenyellow;
      }
      .hide-small-div {
        width: 2px;
      }

      .ocw-home-icon {
        height: 56px !important;
      }

      .icon-inactive {
        color: #b0bec5; /* #9ea7aa;  9e9e9e */
      }
      .icon-active {
        color: greenyellow !important;
      }

      .ocw-side-menu {
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
      }
    `,
  ],
})
export class LayoutSidebarComponent implements OnInit, OnChanges {
  @Input() iconClass = 'primary-grey-back-color';
  @Input() menuMode: MenuMode;
  @Input() menu: TabMenuItem[];
  @Input() userInfo: UserInfoDocument;

  option: number;
  activeClass: string;
  width = 60;

  constructor(
    private logService: LogService,
    private router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    this.logService.log('LayoutSidebarComponent url', this.activatedRoute.url);
  }

  ngOnInit() {
    this.logService.log('layout-sidebar init', this.menu);
    if (this.menu && this.menu.length > 0) {
      this.option = this.menu[0].type;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['menuMode']) {
      if (this.menuMode === MenuMode.Wide) {
        this.width = 180;
      } else {
        this.width = 60;
      }
    }
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
