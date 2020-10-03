import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  AccessContextFactory,
  AuthUserGuard,
  LogService,
  RequestContext,
  UserAccess
} from '@ocw/api-core';
import {
  RequestAction,
  SaveUserProfileRequest,
  ServiceRequest,
  UserInfoDocument,
  UserInfoFilter,
  UserMessageTypes,
  UserProfileDocument
} from '@ocw/shared-models';

@UseGuards(AuthGuard(), AuthUserGuard)
@Controller('resources')
export class UserManager {
  private userMap = new Map<string, UserInfoDocument>();

  constructor(
    private readonly userAccess: UserAccess,
    private readonly accessContextFactory: AccessContextFactory,
    private readonly logService: LogService
  ) {}

  @Post([UserMessageTypes.UserGetCurrent])
  async [UserMessageTypes.UserGetCurrent]() {
    //let dbUserInfo: UserInfoDocument;
    const currentUser = RequestContext.currentUser();

    if (!currentUser) {
      throw new Error('current user not set');
    }
    return await this.userAccess.getByUserId(
      currentUser.userId,
      this.accessContextFactory.getAccessContext()
    );
  }

  @Post([UserMessageTypes.Query])
  async [UserMessageTypes.Query](
    @Body() request: ServiceRequest<UserInfoFilter>
  ) {
    this.logService.info(request, '[UserMessageTypes.Query]  Request');
    const accessContext = this.accessContextFactory.getAccessContext();
    return await this.userAccess.search(request.data, accessContext);
  }

  async getUserInfo(id: string): Promise<UserInfoDocument> {
    return await this.userAccess.get(
      id,
      this.accessContextFactory.getAccessContext()
    );
  }

  async getUserProfile(emailAddress: string): Promise<UserProfileDocument> {
    return await this.userAccess.getProfile(
      emailAddress,
      this.accessContextFactory.getAccessContext()
    );
  }

  /*async saveUserInfo(request: SaveUserInfoRequest): Promise<UserInfoDocument> {
    const accessContext = this.accessContextFactory.getAccessContext();
    let savedUser: UserInfoDocument;

    try {
      await accessContext.beginTransaction();

      if (request.action === RequestAction.Update) {
        const existingUser = await this.userAccess.get(
          request.data.id,
          accessContext
        );

        savedUser = await this.userAccess.update(request.data, accessContext);
      }
      if (request.action === RequestAction.Create) {
        savedUser = await this.userAccess.add(
          request.data.emailAddress,
          request.data,
          this.accessContextFactory.getAccessContext()
        );
      }
      if (request.action === RequestAction.Delete) {
        const existingUser = await this.userAccess.get(
          request.data.id,
          accessContext
        );

        savedUser = await this.userAccess.deleteUser(
          request.data,
          accessContext
        );
      }

      await accessContext.commitTransaction();
      return savedUser;
    } catch (err) {
      await accessContext.rollbackTransaction();
      ExceptionUtil.handleException(err, 'Failure trying to save user');
    }
  }*/

  async saveUserProfile(
    record: SaveUserProfileRequest
  ): Promise<UserProfileDocument> {
    const accessContext = this.accessContextFactory.getAccessContext();
    if (record.action === RequestAction.Update) {
      //TODO: save
      // return await this.userAccess.saveProfile(record.profile, accessContext);
    }
    return new UserProfileDocument();
  }

  async searchUserInfo(request: UserInfoFilter): Promise<UserInfoDocument[]> {
    return await this.userAccess.search(
      request,
      this.accessContextFactory.getAccessContext()
    );
  }
}
