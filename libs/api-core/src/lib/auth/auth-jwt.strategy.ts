import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../configuration/config.service';
import { LogService } from '../logging/log.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly logService: LogService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('CLIENT_SECRET')
    });
  }

  async validate(payload: any) {
    this.logService.log(payload, '[AuthJwtStrategy] validate');
    const user = await this.authService.validateUser(payload);
    this.logService.log(user, '[AuthJwtStrategy] validate');
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
