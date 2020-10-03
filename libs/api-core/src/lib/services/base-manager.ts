import { ServiceRegistry } from './service-registry.service';

export class BaseManager {
  constructor(
    className: string,
    messages: {},
    serviceRegistry: ServiceRegistry
  ) {
    Object.keys(messages).forEach(p => {
      serviceRegistry.register(messages[p], className);
    });
  }
}
