import { Injectable } from '@nestjs/common';
import * as auth from 'auth0';
import { ConfigService } from '../configuration/config.service';

export class Auth0User {
  email: string;
  email_verified: boolean;
  phone_number: string;
  given_name: string;
  npm;
  family_name: string;
  name: string; //full name
  user_id: string;
  connection: string;
}

@Injectable()
export class Auth0Access {
  constructor(private configService: ConfigService) {}

  async getUser(userId: string) {
    const auth0 = new auth.ManagementClient({
      domain: 'opencasework.auth0.com',
      clientId: this.configService.get('AUTH0_CLIENTID'),
      clientSecret: this.configService.get('AUTH0_SECRET'),
      scope: 'read:users read:user_idp_tokens',
    });
    try {
      const user: Auth0User = await auth0.getUser({ id: userId });
      return user;
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  }

  async getUserByEmail(emailAddress: string): Promise<Auth0User> {
    const auth0 = new auth.ManagementClient({
      domain: 'opencasework.auth0.com',
      clientId: this.configService.get('AUTH0_CLIENTID'),
      clientSecret: this.configService.get('AUTH0_SECRET'),
      scope: 'read:users read:user_idp_tokens',
    });
    try {
      const users: Auth0User[] = await auth0.getUsersByEmail(emailAddress);
      if (users.length > 0) {
        return users[0];
      } else {
        return undefined;
      }
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  }

  async addUser(emailAddress: string) {
    const auth0 = new auth.ManagementClient({
      domain: 'opencasework.auth0.com',
      clientId: this.configService.get('AUTH0_CLIENTID'),
      clientSecret: this.configService.get('AUTH0_SECRET'),
      scope: 'read:users create:users',
    });
    const user = new Auth0User();
    user.email = emailAddress;
    user.email_verified = true;
    user['password'] = 'Password-To-Reset!';
    user.connection = 'Username-Password-Authentication';
    try {
      const savedUser: Auth0User = await auth0.createUser(user);
      return savedUser;
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  }

  async updateUser(user: Auth0User, emailAddress: string) {
    const auth0 = new auth.ManagementClient({
      domain: 'opencasework.auth0.com',
      clientId: this.configService.get('AUTH0_CLIENTID'),
      clientSecret: this.configService.get('AUTH0_SECRET'),
      scope: 'read:users update:users',
    });
    user.email = emailAddress;
    user.connection = 'Username-Password-Authentication';
    try {
      const savedUser: Auth0User = await auth0.updateUser(
        { id: user.user_id },
        { email: emailAddress }
      );
      return savedUser;
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  }

  async deleteUser(userId: string) {
    const auth0 = new auth.ManagementClient({
      domain: 'opencasework.auth0.com',
      clientId: this.configService.get('AUTH0_CLIENTID'),
      clientSecret: this.configService.get('AUTH0_SECRET'),
      scope: 'read:users delete:users',
    });
    try {
      await auth0.deleteUser(userId);
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  }

  async createChangePasswordEmail(emailAddress: string) {
    const auth0 = new auth.AuthenticationClient({
      domain: 'opencasework.auth0.com',
      clientId: this.configService.get('AUTH0_CLIENTID'),
      clientSecret: this.configService.get('AUTH0_SECRET'),
    });
    const data = {
      email: emailAddress,
      connection: 'Username-Password-Authentication',
    };
    try {
      await auth0.requestChangePasswordEmail(data);
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  }

  async createPasswordChangeTicket(emailAddress: string) {
    const auth0 = new auth.ManagementClient({
      domain: 'opencasework.auth0.com',
      clientId: this.configService.get('AUTH0_CLIENTID'),
      clientSecret: this.configService.get('AUTH0_SECRET'),
      scope: 'create:user_tickets',
    });
    const data = {
      email: emailAddress,
      mark_email_as_verified: true,
      connection_id: 'con_D0ZoeQbdBotldpbA',
    };
    try {
      await auth0.createPasswordChangeTicket(data);
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  }
}
