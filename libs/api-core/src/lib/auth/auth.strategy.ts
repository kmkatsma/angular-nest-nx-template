import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as passportAzureAd from 'passport-azure-ad';
import { ConfigService } from '../configuration/config.service';
import { LogService } from '../logging/log.service';
import { RequestContext } from '@ocw/api-core';

@Injectable()
export class AuthStrategy extends PassportStrategy(
  passportAzureAd.BearerStrategy,
  'oidc-bearer'
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly logService: LogService
  ) {
    super(
      {
        identityMetadata: configService.get('IDENTITY_ENDPOINT'),
        clientID: configService.get('CLIENT_ID'),
        audience: configService.get('CLIENT_ID'),
        validateIssuer: true,
        loggingLevel: configService.get('AUTH_LOG_LEVEL'),
        passReqToCallback: true,
        scope: ['api-scope'],
        loggingNoPII: false,
        // isB2C: false,
      },
      function (req, token, done) {
        if (!token.oid) done(new Error('oid is not found in token'));
        else {
          done(null, token);
        }
      }
    );
  }
}
