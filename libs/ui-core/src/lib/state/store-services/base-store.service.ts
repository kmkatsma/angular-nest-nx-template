import { ILoggedClass } from '../../logging/logged-class';

export class BaseStoreService implements ILoggedClass {
  constructor() {}

  getClassName(): string {
    return (<any>this).constructor.name;
  }
}
