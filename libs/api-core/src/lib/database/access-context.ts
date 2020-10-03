import * as Knex from 'knex';
import { LogService } from '../logging/log.service';

export class AccessContext {
  public knex: Knex | Knex.Transaction;
  public trxProvider: any;
  public isPostgres = true;

  constructor(
    readonly logService: LogService,
    readonly knexInput: Knex | Knex.Transaction,
    isPostgres?: boolean
  ) {
    if (this.knexInput) {
      this.knex = knexInput;
      this.trxProvider = this.knex.transactionProvider();
    }
    if (!isPostgres) {
      this.isPostgres = false;
    }
  }

  async beginTransaction() {
    this.knex = await this.trxProvider();
  }

  async commitTransaction() {
    await (this.knex as Knex.Transaction).commit();
  }

  async rollbackTransaction() {
    await (this.knex as Knex.Transaction).rollback();
  }
}
