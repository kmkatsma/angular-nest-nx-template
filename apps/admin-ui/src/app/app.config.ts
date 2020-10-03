import { environment } from '../environments/environment';
import { MsalAngularConfiguration } from '@azure/msal-angular';
import { Configuration } from 'msal';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

export const msalConfig: Configuration = {
  auth: {
    clientId: environment.adalConfig.clientId, // This is your client ID
    authority: `https://login.microsoftonline.com/${environment.adalConfig.tenant}`, // This is your tenant ID
    redirectUri: environment.redirectUri, // This is your redirect URI
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
  },
};

export const msalAngularConfig: MsalAngularConfiguration = {
  popUp: !isIE,
  consentScopes: ['openid', 'https://opencasework-dev/api-scope'],
  unprotectedResources: [],
  protectedResourceMap: [
    ['http://localhost:3000', ['openid', 'https://opencasework-dev/api-scope']],
  ],
  extraQueryParameters: {},
};
