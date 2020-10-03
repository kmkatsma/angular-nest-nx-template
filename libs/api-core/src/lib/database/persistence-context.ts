import { AccessContext } from './access-context';

export class PersistenceContext {
  constructor(public readonly accessContext: AccessContext) {}
}
