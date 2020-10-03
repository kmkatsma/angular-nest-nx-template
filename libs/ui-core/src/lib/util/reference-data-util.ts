import { ReferenceItem } from '@ocw/shared-models';
import * as R from 'rambda';

const sortFn = (a, b) => a - b;

export class ReferenceDataUtil {
  static referenceDataMap = {}; // new Map<
  // string,
  //  Map<string | number, ReferenceItem>
  //>();

  static addReferenceItem(referenceType: string, referenceItem: ReferenceItem) {
    let map = this.referenceDataMap[referenceType];
    if (!map) {
      map = {};
      this.referenceDataMap[referenceType] = map;
    }
    if (referenceType.endsWith('Document')) {
      map[referenceItem['id']] = referenceItem;
    } else {
      //if (referenceItem['uid']) {
      map[referenceItem['uid']] = referenceItem;
      //} else {
      //  map[referenceItem['id']] = referenceItem;
    }
  }

  static getReferenceItem(referenceType: string, id: string | number) {
    const map = this.referenceDataMap[referenceType];
    if (map) {
      //console.log('matching map', map);
      return map[id];
    } else {
      return undefined;
    }
  }

  static buildDescriptionList(
    referenceType: string,
    idList: string[] | number[]
  ): string {
    if (idList && idList.length) {
      const map = this.referenceDataMap[referenceType];
      console.log('buildDescriptionList map, values', map, idList);
      let descriptions = [];
      idList.forEach((id) => {
        const sc = map[id];
        if (sc) {
          descriptions.push(sc['val']);
        }
      });
      descriptions = R.sort(sortFn)(descriptions);
      return descriptions.join(', ');
    }
  }

  static getReferenceList(referenceType: string): ReferenceItem[] {
    console.log('getReferenceList', referenceType, this.referenceDataMap);
    const map = this.referenceDataMap[referenceType];
    if (map) {
      return Array.from(map.values());
    } else {
      return [];
    }
  }
}
