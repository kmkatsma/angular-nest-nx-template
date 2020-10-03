import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { CustomMaterialModule } from '@ocw/ui-components';
import { LayoutSidebarButtonComponent } from './layout-sidebar/layout-sidebar-button/layout-sidebar-button.component';
import { LayoutSidebarComponent } from './layout-sidebar/layout-sidebar.component';
import { LayoutSidenavComponent } from './layout-sidenav/layout-sidenav.component';
import { LayoutToolbarUserComponent } from './layout-toolbar-user/layout-toolbar-user.component';
import { LayoutToolbarComponent } from './layout-toolbar/layout-toolbar.component';
import { ToolbarService } from './layout-toolbar/toolbar.service';
import { LayoutComponent } from './layout.component';
import { LayoutService } from './layout.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    CustomMaterialModule,
    LayoutModule
  ],
  declarations: [
    LayoutComponent,
    LayoutToolbarComponent,
    LayoutToolbarUserComponent,
    LayoutSidenavComponent,
    LayoutSidebarComponent,
    LayoutSidebarButtonComponent
  ],
  exports: [LayoutComponent],
  providers: [LayoutService, ToolbarService]
})
export class UiLayoutModule {}
