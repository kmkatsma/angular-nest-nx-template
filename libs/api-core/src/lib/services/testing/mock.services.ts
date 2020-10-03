import { LogService } from '../../logging/log.service';
import { AccessContext } from '../../database/access-context';

export class MockAccessContext {
  public knex: any;
  public trxProvider: any;
  public isPostgres: boolean;

  constructor(readonly logService: LogService, readonly knexInput: any) {}

  async beginTransaction() {}

  async commitTransaction() {}

  async rollbackTransaction() {}
}

export class MockConfigService {
  isPostgres = false;

  get(key: string): string {
    return 'fake-value';
  }
}

export class MockLogService extends LogService {
  error(message: string, trace: string) {}
  warn(message: any, context?: string) {}

  log(message, context?: string) {}

  logObject(object: any, message: string, context?: string) {}

  logQuery = message => {};

  info(message: any, context: string) {}
}

export class MockAccessContextFactory {
  getAccessContext(): AccessContext {
    return new MockAccessContext(new LogService(), undefined);
  }
}

export class MockAuthService {}
