import { services } from './services';

export interface YaApiResponseWrapper {
  response: YaGeoObjectCollectionWrapper;
}

export interface YaGeoObjectCollectionWrapper {
  GeoObjectCollection: YaGeoObjectCollection;
}

export interface YaGeoObjectCollection {
  metaDataProperty: YaResponseMetaDataWrapper | undefined;
  featureMember:    YaFeatureMember[];
}

export interface YaFeatureMember {
  GeoObject: YaGeoObject;
}

export interface YaGeoObject {
  metaDataProperty: YaPropertyMetaDataWrapper;
  name:             string;
  description:      string;
  boundedBy:        BoundedBy;
  Point:            YaPoint;
}

export interface YaPoint {
  pos: string;
}

export interface BoundedBy {
  Envelope: Envelope;
}

export interface Envelope {
  lowerCorner: string;
  upperCorner: string;
}

export interface YaPropertyMetaDataWrapper {
  GeocoderMetaData: YaGeocoderMetaData;
}

export interface YaGeocoderMetaData {
  precision:      string;
  text:           string;
  kind:           string;
  Address:        Address;
  AddressDetails: AddressDetails;
}

export interface Address {
  country_code: string;
  formatted:    string;
  Components:   Component[];
}

export interface Component {
  kind: string;
  name: string;
}

export interface AddressDetails {
  Country: Country;
}

export interface Country {
  AddressLine:        string;
  CountryNameCode:    string;
  CountryName:        string;
  AdministrativeArea: AdministrativeArea;
}

export interface AdministrativeArea {
  AdministrativeAreaName: string;
  SubAdministrativeArea:  SubAdministrativeArea;
}

export interface SubAdministrativeArea {
  SubAdministrativeAreaName: string;
  Locality:                  Locality;
}

export interface Locality {
  LocalityName: string;
}

export interface YaResponseMetaDataWrapper {
  GeocoderResponseMetaData: YaGeocoderResponseMetaData;
}

export interface YaGeocoderResponseMetaData {
  request: string;
  results: string;
  found:   string;
}

class YandexGeocodeService {
  private static _instance: YandexGeocodeService;

  private URL = 'https://geocode-maps.yandex.ru/1.x?';
  private API_KEY = '41cc9996-6a3b-4048-8430-c0f2f8ac6995';

  private constructor() {
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  async search(value: string): Promise<YaGeoObjectCollection> {
    const response = await fetch(this.URL + new URLSearchParams({
      apikey: this.API_KEY,
      geocode: value,
      format: 'json'
    })).catch(errorResponse => {
      services.logger.error(errorResponse);
    });

    if (response && response.ok) {
      const responseWrapper: YaApiResponseWrapper = await response.json();
      if (!(responseWrapper && responseWrapper.response && responseWrapper.response.GeoObjectCollection)) {
        throw Error('Unsupported response body');
      }

      return responseWrapper.response.GeoObjectCollection;
    } else {
      services.logger.error('error', response);

      return {
        featureMember: [],
        metaDataProperty: undefined
      };
    }
  }
}

export const geocodeService = YandexGeocodeService.instance;
