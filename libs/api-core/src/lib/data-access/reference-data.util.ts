import {
  ReferenceItem,
  ReferenceDataGroup,
  ReferenceItemAttribute,
} from '@ocw/shared-models';

export class ReferenceDataUtil {
  static convertToDomainsReference(data: ReferenceItem[]): ReferenceDataGroup {
    const domainGroup = {};
    const domainGroupMap = new Map<
      string,
      Map<string | number, ReferenceItem>
    >();
    if (data && data.length) {
      let domainTypeMap = new Map<string | number, ReferenceItem>();
      for (let i = 0; i < data.length; i++) {
        if (data[i]) {
          const entry: ReferenceItem = data[i];
          domainTypeMap = domainGroupMap.get(
            entry[ReferenceItemAttribute.referenceType]
          );
          if (!domainTypeMap) {
            domainTypeMap = new Map<string | number, ReferenceItem>();
            domainGroupMap.set(entry.referenceType, domainTypeMap);
            domainGroup[entry.referenceType] = [];
          }
          if (entry.referenceType) {
            domainGroup[entry.referenceType].push(entry);
            if (entry.referenceType.endsWith('Document')) {
              domainTypeMap.set(entry['id'], entry);
            } else {
              domainTypeMap.set(entry['uid'], entry);
            }
          } else {
            console.error('missing reference type for entry', entry);
          }
        }
      }
      return {
        results: domainGroup,
        resultsMap: domainGroupMap,
      };
    }
    return { results: domainGroup, resultsMap: domainGroupMap };
  }
}
