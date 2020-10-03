export abstract class Environment {
  production: boolean;
  idleSeconds: number; // time in seconds before the browser triggers warning for inactivity
  idleCountdownSeconds: number; // time in seconds that browser gives user to respond to inactivity warning
  hmr: boolean;
  apiBaseUrl: string;
  apiReportsUrl: string;
  apiBatchUrl: string;
  idServer: string;
  useMockData: boolean;
  adalConfig: AdalConfig;
  clientId: string;
  authDomain: string;
  authAudience: string;
  redirectUri: string;
}

export interface AdalConfig {
  clientId: string;
  tenant: string;
  cacheLocation: string;
  endpoints: AdalEndpoints;
  redirectUri: string;
  postLogoutRedirectUri: string;
}

export interface AdalEndpoints {
  api: string;
}
