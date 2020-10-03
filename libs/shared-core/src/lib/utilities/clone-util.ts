export class CloneUtil {
  static cloneDeep<T>(item: T) {
    return JSON.parse(JSON.stringify(item)) as T;
  }
}
