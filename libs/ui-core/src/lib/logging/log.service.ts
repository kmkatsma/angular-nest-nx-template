import { Injectable } from '@angular/core';
import { Level } from './level';
import { Environment } from '../environment/environment';

// Some browsers don't implement the debug method
const CONSOLE_DEBUG_METHOD = console['debug'] ? 'debug' : 'log';

@Injectable()
export class LogService {
  level: Level;
  isErrorEnabled: boolean;
  isWarnEnabled: boolean;
  isInfoEnabled: boolean;
  isDebugEnabled: boolean;
  isLogEnabled: boolean;

  constructor(private environmentService: Environment) {
    if (environmentService.production === true) {
      this.setLevel(Level.ERROR);
    } else {
      this.setLevel(Level.LOG);
    }
  }

  setLevel(level: Level) {
    this.level = level;
    this.setFlags();
  }

  setFlags() {
    this.isErrorEnabled = this.level >= Level.ERROR;
    this.isWarnEnabled = this.level >= Level.WARN;
    this.isInfoEnabled = this.level >= Level.INFO;
    this.isDebugEnabled = this.level >= Level.DEBUG;
    this.isLogEnabled = this.level >= Level.LOG;
  }

  info(msg?: any, ...args: any[]): void {
    if (this.isInfoEnabled) {
      console.log.apply(console, arguments);
    }
  }

  warn(msg?: any, ...args: any[]): void {
    if (this.isWarnEnabled) {
      console.warn.apply(console, arguments);
    }
  }

  error(message?: any, ...args: any[]) {
    if (this.isErrorEnabled) {
      console.error.apply(console, arguments);
    }
  }

  errorNotify(userMessage: string, message?: any, ...args: any[]) {
    if (this.isErrorEnabled) {
      console.error.apply(console, arguments);
    }
  }

  debug(message?: any, ...args: any[]) {
    if (this.isDebugEnabled) {
      (<any>console)[CONSOLE_DEBUG_METHOD].apply(console, arguments);
    }
  }

  log(message?: any, ...args: any[]) {
    if (this.isLogEnabled) {
      console.log.apply(console, arguments);
    }
  }
}
