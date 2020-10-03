// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  idleSeconds: 600, // time in seconds before the browser triggers warning for inactivity
  idleCountdownSeconds: 10, // time in seconds that browser gives user to respond to inactivity warning
  hmr: false,
  apiBaseUrl: 'http://localhost:3000/api/',
  apiReportsUrl: 'http://localhost:3000/api/',
  apiBatchUrl: 'http://localhost:3000/api/',
  idServer: '',
  useMockData: false,
  adalConfig: {
    clientId: '5577b453-097c-4a42-97c5-fc8433685a83',
    tenant: 'bbb8d215-8a00-4b3a-a546-30de29a9d488',
    cacheLocation: 'localStorage',
    endpoints: {
      api: '5577b453-097c-4a42-97c5-fc8433685a83',
    },
    redirectUri: '',
    postLogoutRedirectUri: '',
  },
  redirectUri: 'http://localhost:4200',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
