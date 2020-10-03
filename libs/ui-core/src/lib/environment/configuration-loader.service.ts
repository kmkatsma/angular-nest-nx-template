import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ConfigurationAdalEndpoint {
  api: string;
}

export class ConfigurationAdal {
  clientId: string;
  tenant: string;
  redirectUri: string;
  postLogoutRedirectUri: string;
}

export interface Configuration {
  production: boolean;
  idleSeconds: number; // time in seconds before the browser triggers warning for inactivity
  idleCountdownSeconds: number; // time in seconds that browser gives user to respond to inactivity warning
  hmr: boolean;
  apiBaseUrl: string;
  apiReportsUrl: string;
  apiBatchUrl: string;
  idServer: string;
  useMock: boolean;
  adalConfig: ConfigurationAdal;
}

/*
@Injectable({
  providedIn: 'root'
})
export class ConfigurationLoaderService {
  private readonly CONFIG_URL = 'assets/config/config.json';
  public configuration: Configuration;

  constructor(private http: HttpClient) {}

  public loadConfigurations(): Promise<any> {
    console.log('start loadConfigurations');

    const response = this.http
      .get<Configuration>(this.CONFIG_URL)
      .toPromise()
      .then(p => {
        console.log('configuration', p);
        this.configuration = p;
        this.configuration.adalConfig.redirectUri =
          window.location.origin + '/';
        this.configuration.adalConfig.postLogoutRedirectUri =
          window.location.origin + '/';
      });
    return response;
  }
}*/
