import { UserAccess } from './user.access';
import {
  UserProfileDocument,
  UserInfoDocument,
  UserProfileSearchRequest,
  UserInfoFilter,
} from '@ocw/shared-models';
import { BaseDocument } from '@ocw/shared-models';
import { AccessContext } from '@ocw/api-core';

export class MockUserAccess extends UserAccess {
  async isInRole(role: number): Promise<boolean> {
    return true;
  }

  getProviderId(): string {
    return '1';
  }

  async add<T extends BaseDocument>(
    emailAddress: string,
    doc: T,
    accessContext: AccessContext
  ): Promise<T> {
    return undefined;
  }

  async addProfile(
    emailAddress: string,
    doc: UserProfileDocument,
    accessContext: AccessContext
  ): Promise<UserProfileDocument> {
    return undefined;
  }

  async deleteUser<T extends UserInfoDocument>(
    doc: T,
    accessContext: AccessContext
  ): Promise<T> {
    return undefined;
  }

  async deleteProfile(
    doc: UserProfileDocument,
    accessContext: AccessContext
  ): Promise<UserProfileDocument> {
    return undefined;
  }

  async update<T extends BaseDocument>(
    doc: T,
    accessContext: AccessContext
  ): Promise<T> {
    return undefined;
  }

  async updateProfile<T extends BaseDocument>(
    doc: T,
    accessContext: AccessContext
  ): Promise<T> {
    return undefined;
  }

  async get<T extends UserInfoDocument>(
    id: string,
    accessContext: AccessContext
  ): Promise<T> {
    return undefined;
  }

  async getProfile<T extends UserProfileDocument>(
    id: string,
    accessContext: AccessContext
  ): Promise<T> {
    return undefined;
  }

  async search<T extends UserInfoDocument>(
    searchRequest: UserInfoFilter,
    accessContext: AccessContext
  ): Promise<T[]> {
    return [];
  }

  async searchProfile<T extends BaseDocument>(
    searchRequest: UserProfileSearchRequest,
    accessContext: AccessContext
  ): Promise<T[]> {
    return [];
  }
}
