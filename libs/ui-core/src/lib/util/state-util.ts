import cloneDeep from 'lodash-es/cloneDeep';

export class StateUtil {
  static cloneDeep<T>(item: T) {
    return cloneDeep(item);
  }
}
