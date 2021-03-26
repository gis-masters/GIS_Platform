import { services } from './services';

interface YaApiResponseWrapper {
  response: {
    GeoObjectCollection: YaGeoObjectCollection;
  };
}

export interface YaGeoObjectCollection {
  metaDataProperty?: {
    GeocoderResponseMetaData: {
      request: string;
      results: string;
      found: string;
    };
  };
  featureMember: { GeoObject: YaGeoObject }[];
}

export interface YaGeoObject {
  metaDataProperty: {
    GeocoderMetaData: {
      precision: string;
      text: string;
      kind: string;
      Address: {
        country_code: string;
        formatted: string;
        Components: { kind: string; name: string }[];
      };
      AddressDetails: { Country: Country };
    };
  };
  name: string;
  description: string;
  boundedBy: {
    Envelope: {
      lowerCorner: string;
      upperCorner: string;
    };
  };
  Point: {
    pos: string;
  };
}

interface Country {
  AddressLine: string;
  CountryNameCode: string;
  CountryName: string;
  AdministrativeArea: {
    AdministrativeAreaName: string;
    SubAdministrativeArea: {
      SubAdministrativeAreaName: string;
      Locality: {
        LocalityName: string;
      };
    };
  };
}

class YandexGeocodeService {
  private static _instance: YandexGeocodeService;

  private URL = 'https://geocode-maps.yandex.ru/1.x?';
  private API_KEY = '41cc9996-6a3b-4048-8430-c0f2f8ac6995';

  private constructor() {}

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  async search(value: string): Promise<YaGeoObjectCollection> {
    const response = await fetch(
      this.URL +
        new URLSearchParams({
          apikey: this.API_KEY,
          geocode: value,
          format: 'json'
        })
    ).catch(errorResponse => {
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
