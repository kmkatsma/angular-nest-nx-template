import * as mockKnex from 'mock-knex';
import { AccessContextFactory } from '../access-context-factory';
 
export class KnexTestUtil {
  static async createTracker(accessContextFactory: AccessContextFactory) {
    await accessContextFactory.onModuleInit();
    mockKnex.mock(accessContextFactory.knex);
    const tracker = mockKnex.getTracker();
    tracker.install();
    return tracker;
  }
}
