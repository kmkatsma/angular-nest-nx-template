import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { UserInfoDocument, AppMenuItem, TabMenuItem } from '@ocw/shared-models';
import { LogService, AuthService } from '@ocw/ui-core';
import { CloneUtil } from '@ocw/shared-core';

export enum MenuMode {
  Wide = 'Wide',
  Narrow = 'Narrow',
}

@Component({
  selector: 'ocw-layout-sidenav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="primary-grey-back-color-dark" fxLayout="column" fxFlex>
      <ocw-layout-sidebar
        [menu]="secureMenu"
        [menuMode]="menuMode"
        [userInfo]="userInfo"
        iconClass="primary-grey-back-color-dark"
      ></ocw-layout-sidebar>
      <div fxFlex class="primary-grey-back-color-dark"></div>
    </div>
  `,
})
export class LayoutSidenavComponent implements OnChanges {
  @Input() menuMode: MenuMode;
  @Input() userInfo: UserInfoDocument;
  @Input() homeMenu: AppMenuItem[];

  iconClass: string;
  secureMenu: TabMenuItem[];

  constructor(
    private logService: LogService,
    private authService: AuthService
  ) {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    console.log(
      'LayoutSidenavComponentmenu changes',
      this.userInfo,
      this.homeMenu
    );
    if (simpleChanges.homeMenu || simpleChanges.userInfo) {
      if (this.homeMenu && this.userInfo) {
        this.populateMenu();
      }
    }
  }

  populateMenu() {
    this.logService.log('calculate menu', this.homeMenu, this.userInfo);
    const calculatedMenu = CloneUtil.cloneDeep(this.buildMenu(this.homeMenu));
    for (let i = 0; i < calculatedMenu.length; i++) {
      const menuItem = calculatedMenu[i];
      menuItem.subMenu = this.buildMenu(menuItem.subMenu);
    }
    this.secureMenu = CloneUtil.cloneDeep(calculatedMenu);
    console.log('secureMenu', this.secureMenu);
  }

  buildMenu(menu: AppMenuItem[]): AppMenuItem[] {
    const calculatedMenu: AppMenuItem[] = [];
    for (let i = 0; i < menu.length; i++) {
      const menuItem = menu[i];
      let addMenu = false;
      if (
        this.authService.hasAccess(menuItem) &&
        this.authService.hasTenantAccess(menuItem)
      ) {
        addMenu = true;
      }
      if (addMenu) {
        calculatedMenu.push(menuItem);
      }
    }
    return calculatedMenu;
  }
}
