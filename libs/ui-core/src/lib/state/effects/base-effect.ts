import { ILoggedClass } from '../../logging/logged-class';

 

export class BaseEffect implements ILoggedClass {
  constructor() {}

  getClassName(): string {
    return (<any>this).constructor.name;
  }
}
