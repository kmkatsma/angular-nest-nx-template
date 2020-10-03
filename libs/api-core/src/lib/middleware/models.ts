import { HttpException, HttpStatus } from '@nestjs/common';
import * as cls from 'cls-hooked';
import * as cuid from 'cuid';
import { IncomingMessage } from 'http';
import { Response } from 'express';
import { UserInfoDocument } from '@ocw/shared-models';
import { LogService } from '../logging/log.service';
import { UserInfo } from 'os';

export interface UserToken {
  preferred_username: string;
  email: string;
  family_name: string;
  given_name: string;
  groups: string[];
  name: string;
  oid: string;
  roles: string[];
  ver: string;
  iss: string;
}

export class CurrentUser {
  public userName: string;
  public id: string;
  public container: string;
  public tenantId: number;
  public tenantDomain: string;
  tenantState: string;
  public isProvider: boolean;
  public constituentId: string;
  public providerId: string;
  public locationId: number;
  public roles: number[] = [];
  public email: string;
  public userId: string;

  constructor(user: UserInfoDocument | UserToken) {
    if (user['scp'] === 'api-scope') {
      const tokenUser = user as UserToken;
    } else {
      const auth0User = user as UserInfoDocument;
      const email = auth0User.emailAddress;
      this.userId = auth0User.userId;
      this.userName = email.split('@')[0].toUpperCase();
      this.tenantDomain = email.split('@')[1].toLowerCase();
      this.tenantState = auth0User.tenantState;
      this.email = email;
      this.tenantId = auth0User.tenantId;
      if (auth0User.providerId) {
        this.providerId = auth0User.providerId.toString();
        this.isProvider = true;
      }
      this.locationId = auth0User.locationId;
      this.id = auth0User.id;
      if (user.roles) {
        user.roles.forEach((element) => {
          this.roles.push(element);
        });
      }
    }
  }
}

export class RequestContext {
  public static nsid = cuid();
  public readonly id: number;
  public request: Request;
  public response: Response;
  public user: CurrentUser;

  constructor(request: Request, response: Response) {
    this.id = Math.random();
    this.request = request;
    this.response = response;
  }

  public static currentRequestContext(): any {
    const session = cls.getNamespace(RequestContext.nsid);
    if (session && session.active) {
      return session.get(RequestContext.name);
    }
    return undefined;
  }

  public static currentRequest(): IncomingMessage {
    const requestContext = RequestContext.currentRequestContext();

    if (requestContext) {
      return requestContext.request;
    }

    return undefined;
  }

  public static currentResponse(): Response {
    const requestContext = RequestContext.currentRequestContext();

    if (requestContext) {
      return requestContext.response;
    }

    return undefined;
  }

  public static setCurrentUser(user: CurrentUser) {
    const requestContext = RequestContext.currentRequestContext();
    requestContext.user = user;
  }

  public static currentUser(throwError?: boolean): CurrentUser {
    const requestContext = RequestContext.currentRequestContext();
    if (requestContext) {
      if (requestContext.user) {
        return requestContext.user;
      }
      if (requestContext.request) {
        const user: any = requestContext.request.user;
        if (user) {
          return new CurrentUser(user);
        }
      }
    }

    if (throwError) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return undefined;
  }
}
