import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserAccess } from '../data-access/user.access';
import { RequestContext } from '../middleware/models';
import { request } from 'http';

@Injectable()
export class AuthUserGuard implements CanActivate {
  constructor(private userAccess: UserAccess) {}

  // Validate if token passed along with HTTP request
  // is associated with any registered account in the database
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requestContext = RequestContext.currentRequestContext();
    console.log('user', requestContext.request.user);
    return await this.userAccess.getCurrentUser(
      requestContext.request.user.sub
    );
  }
}
