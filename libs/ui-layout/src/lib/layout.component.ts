import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BaseAppStateEnum,
  UserInfoDocument,
  AppMenuItem,
} from '@ocw/shared-models';
import {
  AppStoreService,
  EventsService,
  LogService,
  StatusPayload,
  StatusStoreService,
  SystemMessageType,
} from '@ocw/ui-core';
import { Observable, Subject, Subscription } from 'rxjs';
import { startWith, takeUntil, throttleTime } from 'rxjs/operators';
import { MenuMode } from './layout-sidenav/layout-sidenav.component';
import { ToolbarService } from './layout-toolbar/toolbar.service';
import { LayoutService } from './layout.service';

enum ScreenMode {
  Mobile = 'Mobile',
  NonMobile = 'NonMobile',
}

@Component({
  selector: 'ocw-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ocw-layout-container">
      <ocw-layout-toolbar
        [title]="title"
        [user]="userInfo"
        [location]="toolbarService.primaryLocation$ | async"
      ></ocw-layout-toolbar>
      <mat-sidenav-container [autosize]="true" style="height:100%">
        <mat-sidenav
          *ngIf="loggedIn"
          #sidenav
          [ngStyle]="{
            'width.px': width
          }"
          fixedInViewport="true"
          [mode]="sideNavMode"
          [(opened)]="opened"
          fixedTopGap="56"
        >
          <ocw-layout-sidenav
            fxFlex
            class="primary-grey-back-color-dark"
            [menuMode]="menuMode"
            [userInfo]="userInfo"
            [homeMenu]="homeMenu"
          ></ocw-layout-sidenav>
        </mat-sidenav>
        <mat-sidenav-content style="height:100%">
          <div fxFlex fxLayout="column">
            <div fxFlex="none" style="height: 56px"></div>
            <div fxLayout="row" fxFlex>
              <div fxFlex>
                <router-outlet></router-outlet>
              </div>
            </div>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
})
export class LayoutComponent implements OnInit, OnDestroy, OnChanges {
  @Input() title: string;
  @Input() loggedIn: boolean;
  @Input() userInfo: UserInfoDocument;
  @Input() homeMenu: AppMenuItem[];
  private status$: Observable<StatusPayload>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private subscriptions: Array<Subscription> = [];
  private screenMode = ScreenMode.NonMobile;
  sideNavMode = 'side';
  menuMode = MenuMode.Narrow;
  opened = true;
  width = 60;

  constructor(
    private statusStore: StatusStoreService,
    private logService: LogService,
    private eventService: EventsService,
    private layoutService: LayoutService,
    private appStoreService: AppStoreService,
    private activatedRoute: ActivatedRoute,
    public toolbarService: ToolbarService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    //this.idleService.reset();
    this.activatedRoute.data
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((p) => {
        this.logService.log('activated Route Data', p);
        if (p['location']) {
          this.toolbarService.setLocation(p['location']);
        }
      });

    // errors
    this.status$ = this.statusStore.Status$().pipe(
      startWith(new StatusPayload(null, '', SystemMessageType.Information)),
      //distinctUntilChanged(this.statusComparer),
      throttleTime(500),
      takeUntil(this.ngUnsubscribe)
    );
    this.subscriptions.push(
      this.status$.subscribe((res) => this.layoutService.displayStatus(res))
    );

    this.appStoreService
      .AppState$(BaseAppStateEnum.SideNavOpened)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((p) => {
        this.logService.log('side nav status', p);
        this.toggleMenu();
      });

    this.eventService.on('LogOff', () => {
      this.subscriptions.forEach((subscription: Subscription) => {
        subscription.unsubscribe();
      });
    });

    this.breakpointObserver
      .observe(['(min-width: 500px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          console.log('Viewport is 500px or over!');
          this.screenMode = ScreenMode.NonMobile;
          this.configureMenu();
        } else {
          this.screenMode = ScreenMode.Mobile;
          this.configureMenu();
          console.log('Viewport is getting smaller!');
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.logService.log(
      'LayoutComponent chnages',
      this.userInfo,
      this.homeMenu
    );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  toggleMenu() {
    if (this.screenMode === ScreenMode.NonMobile) {
      if (this.menuMode === MenuMode.Narrow) {
        this.menuMode = MenuMode.Wide;
        this.width = 180;
      } else {
        this.menuMode = MenuMode.Narrow;
        this.width = 60;
      }
    } else {
      this.opened = !this.opened;
    }
    this.configureMenu();
  }

  configureMenu() {
    if (this.screenMode === ScreenMode.NonMobile) {
      this.sideNavMode = 'side';
      if (this.menuMode === MenuMode.Narrow) {
      }
      if (this.menuMode === MenuMode.Wide) {
      }
    } else {
      this.sideNavMode = 'over';
    }
  }

  statusComparer(p: StatusPayload, q: StatusPayload): boolean {
    console.log('statusComparer', p, q);
    if (p && q) {
      return p.message === q.message;
    }
    return false;
  }
}
