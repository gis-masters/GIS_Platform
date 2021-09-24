import { services } from './services';
import { saveAsCsv } from './util/FileSaver';
import { CrgLayer } from './crg/projects.models';
import { OldFeatureDescription } from './crg/schemaOld.models';
import { schemaService } from './crg/schema.service';
import { getFeatures } from './geoserver/wfs.service';
import { FilterEvent, RequestAttribute } from './models';
import { WfsFeature, WfsFeatureCollection } from './geoserver/wfs.models';

import { Toast } from '../components/Toast/Toast';

class CsvExporter {
  private static _instance: CsvExporter;

  private BATCH_SIZE = 500;

  private constructor() {}

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  async exportLayer(layer: CrgLayer, filter?: FilterEvent[]) {
    try {
      const schema = await schemaService.getById(layer.schemaId);

      const allFeatures: WfsFeature[] = await this.fetchPaged(layer, filter);

      saveAsCsv(`${layer.tableName}.csv`, this.unparseFeatures(schema, allFeatures));
    } catch (error) {
      const msg = `Не удалось выполнить экспорт слоя: ${layer.title}`;
      Toast.error(msg);
      services.logger.error(msg, error);
    }
  }

  async exportFeatures(schemaId: string, features: WfsFeature[]) {
    try {
      const schema = await schemaService.getById(schemaId);

      saveAsCsv(`${schema.tableName}.csv`, this.unparseFeatures(schema, features));
    } catch (error) {
      const msg = 'Не удалось выполнить экспорт объектов';
      Toast.error(msg);
      services.logger.error(msg, error);
    }
  }

  private async fetchPaged(layer: CrgLayer, filter?: FilterEvent[]): Promise<WfsFeature[]> {
    const { complexName, nativeCRS } = layer;

    let result: WfsFeature[] = [];
    let totalPages = 0;
    let currentPage = 0;

    do {
      const requestAttribute: RequestAttribute = {
        filter: filter,
        page: {
          pageSize: this.BATCH_SIZE,
          offset: currentPage
        }
      };

      const response: WfsFeatureCollection = await getFeatures(complexName, nativeCRS, requestAttribute);
      if (response.features) {
        totalPages = Math.ceil(response.totalFeatures / this.BATCH_SIZE);
        if (response.features.length) {
          result = [...result, ...response.features];
        }
      }

      currentPage++;
    } while (currentPage < totalPages);

    return result;
  }

  private unparseFeatures(schema: OldFeatureDescription, allFeatures: WfsFeature[]): string {
    const header = schema.properties.map(prop => prop.title).join(';');
    const body = allFeatures.map(feature => this.unparseFeature(schema, feature)).join('\n');

    return header + '\n' + body;
  }

  private unparseFeature(schema: OldFeatureDescription, feature: WfsFeature): string {
    const aliasedFeature = schemaService.replaceRowDataToAliases(schema, feature.properties);

    return schema.properties
      .map(prop => {
        const value = aliasedFeature[prop.name.toLowerCase()];

        return value ? value : '';
      })
      .join(';');
  }
}

export const csvExporter = CsvExporter.instance;
