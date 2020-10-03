import { AccessContext } from './access-context';
import { AccessContextFactory } from './access-context-factory';


export class AccessContextUtil {
  static getAccessContext(
    accessContext: AccessContext,
    accessContextFactory: AccessContextFactory
  ): AccessContext {
    if (accessContext) {
      return accessContext;
    } else {
      return accessContextFactory.getAccessContext();
    }
  }
}
