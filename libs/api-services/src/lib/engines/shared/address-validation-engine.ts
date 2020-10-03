import {
  Address,
  AddressAttribute,
  AddressReferenceData,
  ReferenceValueAttribute,
  ReferenceValue,
  TownshipInfo,
  AddressMatch
} from '@ocw/shared-models';
import {
  LogService,
  AccessContextFactory,
  ReferenceDataAccess
} from '@ocw/api-core';
import { Injectable } from '@nestjs/common';
import { createClient } from '@google/maps';
import { SystemSettingAccess } from '@ocw/api-access';

@Injectable()
export class AddressValidationEngine {
  constructor(
    private readonly logService: LogService,
    private systemSettingAccess: SystemSettingAccess,
    private accessContextFactory: AccessContextFactory,
    private referenceDataAccess: ReferenceDataAccess
  ) {}

  async getAddress(placeId: string) {
    const apiKey = await this.systemSettingAccess.getSetting(
      'google-maps-api-key',
      this.accessContextFactory.getAccessContext()
    );

    const addressDomains: AddressReferenceData = await this.referenceDataAccess.getReferenceDataGroup<
      AddressReferenceData
    >('AddressReferenceData');

    const googleMapsClient = createClient({
      key: apiKey,
      Promise: Promise
    });

    const place = await googleMapsClient
      .place({ placeid: placeId })
      .asPromise();
    this.logService.trace(
      '[AddressValidationEngine.getAddress.place]',
      JSON.stringify(place.json.result)
    );

    const address = new Address();
    let streetNumber: string;
    let route: string;
    if (place.json.status === 'OK') {
      place.json.result.address_components.forEach(p => {
        this.logService.trace('types', p.types);
        if (p.types.indexOf('street_number') !== -1) {
          streetNumber = p.short_name;
        }
        if (p.types.indexOf('route') !== -1) {
          route = p.short_name;
        }
        if (p.types.indexOf('locality') !== -1) {
          const matchCity = addressDomains.cities.find(
            city => city.name === p.long_name
          );
          if (matchCity) {
            address.city = matchCity.name;

            if (matchCity.townships) {
              let townshipInfo: TownshipInfo;
              if (matchCity.townships.length === 1) {
                townshipInfo = matchCity.townships[0];
              } else {
                townshipInfo = matchCity.townships.find(
                  t => t.isDefault === true
                );
              }
              if (townshipInfo) {
                const township = addressDomains.townships.find(
                  t => t.uid === townshipInfo.townshipId
                );
                if (township) {
                  address.township = township.uid;
                }
              }
            }
          } else {
            address.city = p.long_name;
          }
        }
        if (p.types.indexOf('administrative_area_level_1') !== -1) {
          const matchState = addressDomains.states.find(
            state => state[ReferenceValueAttribute.val] === p.short_name
          );
          if (matchState) {
            address[AddressAttribute.state] = matchState.val;
          }
        }
        if (p.types.indexOf('postal_code') !== -1) {
          const matchPostal = addressDomains.postalCodes.find(
            code => code[ReferenceValueAttribute.name] === p.short_name
          );
          if (matchPostal) {
            address[AddressAttribute.postalCode] = matchPostal.val;
          } else {
            const newPostal = new ReferenceValue(0, p.short_name);
            address[AddressAttribute.postalCode] = newPostal.val;
            console.log('new postal', newPostal);
          }
        }
      });
      if (streetNumber) {
        address[AddressAttribute.address1] = streetNumber + ' ' + route;
      } else {
        address[AddressAttribute.address1] = route;
      }
    }

    return address;
  }

  async getRecommendations(address: string): Promise<AddressMatch[]> {
    const apiKey = await this.systemSettingAccess.getSetting(
      'google-maps-api-key',
      this.accessContextFactory.getAccessContext()
    );
    this.logService.trace('getRecommendations', ['apiKey', apiKey]);
    const matches = new Array<AddressMatch>();

    const googleMapsClient = createClient({
      key: apiKey,
      Promise: Promise
    });

    const results = await googleMapsClient
      .placesAutoComplete({
        input: address,
        language: 'en',
        sessiontoken: '',
        radius: 50000,
        location: [41.88432, -87.6387]
      })
      .asPromise();

    results.json.predictions.forEach(element => {
      const match = new AddressMatch();
      match.placeId = element.place_id;
      match.formattedAddress = element.description;
      matches.push(match);
    });

    return matches;
  }
}
