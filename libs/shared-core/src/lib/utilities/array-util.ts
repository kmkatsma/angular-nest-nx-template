export class ArrayUtil {
  static addNonNullElement(array: string[], value: string) {
    if (value) {
      array.push(value);
    }
  }
}
