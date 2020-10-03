import * as diff from 'deep-diff';

export class DiffUtil {
  static getDifferences(existingObject: any, updatedObject: any): any {
    const differences = diff(
      existingObject,
      updatedObject,
      (path, key) =>
        // tslint:disable-next-line: no-bitwise
        path.length === 0 && ~['auditInfo', 'rowVersion'].indexOf(key)
    );
    return differences;
  }
}
