import { map, startWith } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, AbstractControl } from '@angular/forms';
import { LogService } from '@ocw/ui-core';
import {
  ReferenceValue,
  ReferenceItem,
  ReferenceValueAttribute
} from '@ocw/shared-models';
import * as R from 'rambda';

//export const SELECT_DESCRIPTION_FIELD = 'shortDescription';
//export const LISTITEM_DESCRIPTION_FIELD = 'val';
//export const ID_FIELD = 'id';

@Injectable()
export class AutoCompleteService {
  constructor(private logService: LogService) {}

  convertToReferenceValue(input: string | ReferenceValue): ReferenceValue {
    const referenceValue = new ReferenceValue();
    referenceValue.uid = 0;
    if (!input) {
      return referenceValue;
    }
    if (typeof input === 'object') {
      return input;
    }
    referenceValue.val = input;
    return referenceValue;
  }

  /*assignSelectValue(control: SelectItem): number {
    if (control) {
      return control.id;
    } else {
      return 0;
    }
  }*/

  assignSelectStringValue(control: any): string {
    if (control) {
      return control.id;
    } else {
      return undefined;
    }
  }

  /*assignUndefinedSelectValue(control: SelectItem): number {
    if (control) {
      return control.id;
    } else {
      return undefined;
    }
  }*/

  assignGenericValue(control: any, property: string): number {
    if (control) {
      return control[property];
    } else {
      return 0;
    }
  }

  displayValue(value: any) {
    return value;
  }

  /*displayShortDescription(selected: SelectItem): any {
    return selected ? selected.shortDescription : selected;
  }

  displayLongDescription(selected: SelectItem): any {
    return selected ? selected.longDescription : selected;
  }

  }*/

  displayReferenceItem(selected: ReferenceValue): string | undefined {
    if (selected) {
      return selected.val;
    } else {
      return undefined;
    }
  }

  displayReferenceWithCustomField(
    selected: ReferenceValue
  ): string | undefined {
    if (selected) {
      if (selected['name']) {
        return selected.val + ' - ' + selected['name'];
      }
      return selected.val;
    } else {
      return undefined;
    }
  }

  displayReferenceFromLookup(
    uid: number,
    array: ReferenceItem[]
  ): string | undefined {
    const selected = array.find(p => p.uid === uid);
    if (selected === undefined || selected === null) {
      return undefined;
    }
    return selected.val ? selected.val : selected.name;
  }

  displayReferenceFromLookupProperty(
    value: number | string,
    propertyName: string,
    array: ReferenceItem[]
  ): string | number | undefined {
    if (!array) {
      return undefined;
    }
    const selected = array.find(p => p[propertyName] === value);
    if (selected === undefined || selected === null) {
      return value;
    }
    return selected.val ? selected.val : selected.name;
  }

  getReferenceValue(array: ReferenceItem[], uid: number): ReferenceValue {
    if (!array) {
      return undefined;
    }
    const match = array.find(p => p.uid === uid);
    if (match) {
      const refVal = new ReferenceValue();
      refVal[ReferenceValueAttribute.uid] = match[ReferenceValueAttribute.uid];
      refVal[ReferenceValueAttribute.val] = match[ReferenceValueAttribute.val];
      return refVal;
    }
    return undefined;
  }

  filteredItem$<T>(
    list: T[],
    control: FormControl,
    propertyName: string
  ): Observable<T[]> {
    let filteredItems: Observable<T[]>;
    if (list) {
      filteredItems = control.valueChanges.pipe(
        startWith(null),
        map(item =>
          item && typeof item === 'object' ? item[propertyName] : item
        ),
        map(value =>
          value
            ? this.filterGeneric<T>(list, value, propertyName)
            : list.slice()
        )
      );
    }
    return filteredItems;
  }

  filteredItemAbstract$<T>(
    list: T[],
    control: AbstractControl,
    propertyName: string
  ): Observable<T[]> {
    this.logService.log('filteritem', control);
    let filteredItems: Observable<T[]>;
    if (list) {
      filteredItems = control.valueChanges.pipe(
        startWith(null),
        map(item =>
          item && typeof item === 'object' ? item[propertyName] : item
        ),
        map(value =>
          value
            ? this.filterGeneric<T>(list, value, propertyName)
            : list.slice()
        )
      );
    }
    return filteredItems;
  }

  getListObservable<T>(
    referenceList: Array<ReferenceItem>,
    control: AbstractControl
  ): Observable<ReferenceValue[]> {
    return this.filteredItemAbstract$<ReferenceValue>(
      referenceList.map(function(val) {
        return { uid: val.uid, val: val.val };
      }),
      control,
      'val'
    );
  }

  getObservableReferenceValues<T>(
    referenceList: Array<ReferenceValue>,
    control: AbstractControl
  ): Observable<ReferenceValue[]> {
    return this.filteredItemAbstract$<ReferenceValue>(
      referenceList.map(function(val) {
        return { uid: val.uid, val: val.val };
      }),
      control,
      'val'
    );
  }

  filteredRefItem$<T>(
    list: T[],
    control: AbstractControl,
    propertyName: string
  ): Observable<T[]> {
    this.logService.log('filteritem', control);
    let filteredItems: Observable<T[]>;
    if (list) {
      filteredItems = control.valueChanges.pipe(
        startWith(null),
        map(item =>
          item && typeof item === 'object' && item['refVal']
            ? item['refVal'][propertyName]
            : item
        ),
        map(value =>
          value
            ? this.filterRefGeneric<T>(list, value, propertyName)
            : list.slice()
        )
      );
    }
    return filteredItems;
  }

  filteredNestedItems$<T>(
    list: T[],
    control: AbstractControl,
    path: string[]
  ): Observable<T[]> {
    this.logService.log('filteritem', control);
    let filteredItems: Observable<T[]>;
    if (list) {
      filteredItems = control.valueChanges.pipe(
        startWith(null),
        map(value =>
          value ? this.filterNestedGeneric<T>(list, value, path) : list.slice()
        )
      );
    }
    return filteredItems;
  }

  filterRefGeneric<T>(list: T[], value: any, propertyName: string): T[] {
    const strValue: string = value
      .toString()
      .replace('\\', '')
      .replace('(', '')
      .replace(')', '');
    return list.filter(option =>
      new RegExp(`^${strValue}`, 'gi').test(option['refVal'][propertyName])
    );
  }

  filterNestedGeneric<T>(list: T[], value: any, path: string[]): T[] {
    const strValue: string = value
      .toString()
      .replace('\\', '')
      .replace('(', '')
      .replace(')', '');
    return list.filter(option =>
      new RegExp(`^${strValue}`, 'gi').test(R.path(path, option))
    );
  }

  filterGeneric<T>(list: T[], value: any, propertyName: string): T[] {
    const strValue: string = value
      .toString()
      .replace('\\', '')
      .replace('(', '')
      .replace(')', '');
    return list.filter(option =>
      new RegExp(`^${strValue}`, 'gi').test(option[propertyName])
    );
  }
}
