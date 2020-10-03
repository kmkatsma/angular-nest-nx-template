import { InjectionToken } from '@angular/core';

export const enum ApiType {
  Default = 0
}

export interface RequestInput {
  body?: any;
  params?: {
    [key: string]: any | any[];
  };
}

export enum ResourceTypeEnum {
  Resource = 1,
  Search = 2,
  Domain = 3,
  App = 4,
  AppExtension = 5,
}
