import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventsService } from '../events/events.service';
import { AuditInfo } from '@ocw/shared-models';

@Injectable()
export class MockAuthService {
  private loggedIn = false;
  public userName = 'KKATSMA';
  redirectUrl: string;
  constructor(private eventService: EventsService) {
    console.log('i was called!');
  }

  login(username: string, password: string): Promise<boolean> {
    this.loggedIn = true;
    console.log('mock service');
    return new Promise<boolean>((resolve, reject) => {
      console.log('before oauthService call');
      return resolve(this.loggedIn);
    });
  }

  isLoggedIn() {
    return true;
  }

  logout(): void {
    this.eventService.broadcast('LogOut');
    console.log('i tried to log out');
  }

  toGMTDate(indate: Date): Date {
    const date = new Date();
    date.setTime(indate.valueOf() + 60000 * indate.getTimezoneOffset());
    return date;
  }

  public getCreateAudit(): AuditInfo {
    const auditInfo = new AuditInfo();
    const date = new Date();
    auditInfo.crtBy = this.userName;
    auditInfo.updBy = this.userName;
    auditInfo.crtTs = Math.round(+date / 1000);
    auditInfo.updTs = Math.round(+date / 1000);
    return auditInfo;
  }

  public setUpdateAudit(auditInfo: AuditInfo) {
    const date = new Date();
    auditInfo.updBy = this.userName;
    auditInfo.updTs = Math.round(+date / 1000);
    return auditInfo;
  }
}
