import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthService,
  Auth0Service,
  ResourceStoreService,
  DomainStoreService,
  SystemMessageType,
} from '@ocw/ui-core';
import { timer } from 'rxjs';
import {
  ReferenceDataMessages,
  BaseDomainKeyEnum,
  BaseDomainEnum,
} from '@ocw/shared-models';

@Component({
  selector: 'ocw-logout',
  template: `
    <div fxLayout="row" class="background">
      <div class="full-screen">
        <div class="max-width aligner">
          <mat-card *ngIf="showLogin" class="card-5">
            <mat-card-title class="font-20">Not Logged In </mat-card-title>
            <mat-card-content>
              You are not logged in to the system. Click LOGIN button to Login
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" (click)="login()">
                LOGIN
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./logout.component.css'],
})
export class LogoutComponent implements OnInit {
  showLogin = false;

  constructor(
    public router: Router,
    private auth0Service: Auth0Service,
    private resourceService: ResourceStoreService,
    private authService: AuthService,
    private domainService: DomainStoreService,
    private cd: ChangeDetectorRef
  ) {
    this.showLogin = true;
  }

  ngOnInit() {
    const timer$ = timer(10000);
    const subscribe = timer$.subscribe((val) => {
      this.showLogin = true;
      this.cd.detectChanges();
    });

    //this.auth0Service.userProfile$.pipe(takeUntil(timer$)).subscribe(p => {
    /* console.log('Logout component: auth0 service logged in', p);
      if (p && p.name) {
        this.authService.loadUser();
      } else {
        console.log('try to login!!');
      }*/
    //});

    /*this.resourceService
      .Resource$(BaseResourceEnum.CurrentUser)
      .subscribe(res => {
        this.router.navigate([AppPathEnum.UrlHome]);
      });*/
  }

  login() {
    if (!this.auth0Service.loggedIn) {
      this.auth0Service.login();
    } else {
      this.authService.loadUser();
      this.domainService.loadDomains(
        BaseDomainEnum.SystemReference,
        BaseDomainKeyEnum.System,
        ReferenceDataMessages.Read,
        { noCache: false }
      );
    }
  }
}
