import { Injectable } from '@nestjs/common';
import { UserMessageTypes, ServiceRequest } from '@ocw/shared-models';
import { ServiceRegistry } from '../services/service-registry.service';
import { UserAccess } from '../data-access/user.access';

@Injectable()
export class AuthService {
  constructor(private readonly userAccess: UserAccess) {}

  // Validate if token passed along with HTTP request
  // is associated with any registered account in the database
  async validateUser(token: string): Promise<any> {
    return await this.userAccess.getCurrentUser(token);
  }
}
