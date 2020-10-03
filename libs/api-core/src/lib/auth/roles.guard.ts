import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserAccess } from '../data-access/user.access';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private userAccess: UserAccess) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.get<number>(
      'permission',
      context.getHandler()
    );
    console.log('permission', permission);
    if (!permission) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return await this.userAccess.hasPermission(permission);
  }
}
