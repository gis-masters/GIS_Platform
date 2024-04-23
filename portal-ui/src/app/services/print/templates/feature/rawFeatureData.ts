import { getFeaturesListItemTitle } from '../../../../components/FeaturesListItem/FeaturesListItem.util';
import { applyView, getReadablePropertyValue } from '../../../data/schema/schema.utils';
import { WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { getLayerSchema } from '../../../gis/layers/layers.service';
import { getLayerByFeatureInCurrentProject } from '../../../gis/layers/layers.utils';
import { PrintTemplate } from '../PrintTemplate';

export const rawFeatureData: PrintTemplate<WfsFeature> = new PrintTemplate({
  name: 'rawFeatureData',
  title: 'Данные',
  margin: [5, 10, 20, 10],
  orientation: 'portrait',
  format: 'a4',

  async render(this: PrintTemplate<WfsFeature>, entity: WfsFeature) {
    const layer = getLayerByFeatureInCurrentProject(entity);

    if (!layer) {
      throw new Error('Layer not found');
    }

    const schema = await getLayerSchema(layer);
    if (!schema) {
      throw new Error(`Не удалось получить схему слоя ${layer.title}`);
    }
    const schemaWithAppliedView = applyView(schema, layer.view);
    const { title } = getFeaturesListItemTitle(entity, schemaWithAppliedView);

    const propertiesHtmlFragments = await Promise.all(
      Object.entries(entity.properties)
        .filter(([key]) => key !== 'shape')
        .map(async ([key, value]) => {
          const property =
            schemaWithAppliedView.properties.find(({ name }) => name === key) ||
            schema.properties.find(({ name }) => name === key);

          return await this.renderFragment('property', {
            title: property?.title || key,
            value: getReadablePropertyValue(value, property)
          });
        })
    );

    return this.renderFragment('main', {
      title,
      properties: propertiesHtmlFragments.join('')
    });
  },

  async getFileName(this: PrintTemplate<WfsFeature>, entity: WfsFeature) {
    const layer = getLayerByFeatureInCurrentProject(entity);

    if (!layer) {
      throw new Error('Layer not found');
    }

    const schema = await getLayerSchema(layer);
    if (!schema) {
      throw new Error(`Не удалось получить схему слоя ${layer.title}`);
    }
    const schemaWithAppliedView = applyView(schema, layer.view);

    const { title } = getFeaturesListItemTitle(entity, schemaWithAppliedView);

    return `${title} [${this.title}]`;
  }
});
