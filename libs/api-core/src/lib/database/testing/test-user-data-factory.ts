import { UserInfoDocument } from '@ocw/shared-models';

export class TestUserDataFactory {
  static createUserInfo() {
    const userInfo = new UserInfoDocument();
    userInfo.emailAddress = 'test@gmail';
    userInfo.locationId = 1;
    userInfo.userId = 'test@gmail.com';
    return userInfo;
  }
}
