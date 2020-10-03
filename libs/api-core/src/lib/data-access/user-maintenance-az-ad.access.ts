import { BadRequestException, Injectable } from '@nestjs/common';
import { UserInfoDocument } from '@ocw/shared-models';
import { AccessContext } from '../database/access-context';
import { GenericAccessUtil } from '../database/generic.access';
import { Auth0Access } from './auth0.access';
import { UserInfoTableConfig } from './tables/user_info';

@Injectable()
export class UserMaintenanceAzAdAccess {
  private userMap = new Map<string, UserInfoDocument>();

  //TODO: replace auth0 with az ad equiv
  constructor(private readonly auth0Access: Auth0Access) {}

  async add<T extends UserInfoDocument>(
    emailAddress: string,
    doc: T,
    accessContext: AccessContext
  ): Promise<T> {
    let auth0User = await this.auth0Access.getUserByEmail(emailAddress);
    if (!auth0User) {
      auth0User = await this.auth0Access.addUser(emailAddress);
    }
    await this.auth0Access.createChangePasswordEmail(emailAddress);
    doc.userId = auth0User.user_id;
    return (await GenericAccessUtil.add(
      accessContext,
      doc,
      UserInfoTableConfig,
      {}
    )) as T;
  }

  async deleteUser<T extends UserInfoDocument>(
    doc: T,
    accessContext: AccessContext
  ): Promise<T> {
    await this.auth0Access.deleteUser(doc.userId);
    return await GenericAccessUtil.delete(
      accessContext,
      doc,
      UserInfoTableConfig
    );
  }

  async update<T extends UserInfoDocument>(
    doc: T,
    accessContext: AccessContext
  ): Promise<T> {
    const user = await this.auth0Access.getUser(doc.userId);
    if (!user) {
      throw new BadRequestException('User does not exist in Auth0');
    }
    if (user.email !== doc.emailAddress) {
      await this.auth0Access.updateUser(user, doc.emailAddress);
    }
    return (await GenericAccessUtil.update(
      accessContext,
      doc,
      UserInfoTableConfig,
      {}
    )) as T;
  }
}
