import { Coordinate } from 'ol/coordinate';
import moment from 'moment';

import { getFeaturesListItemTitle } from '../../../../components/FeaturesListItem/FeaturesListItem.util';
import { applyView, getReadablePropertyValue } from '../../../data/schema/schema.utils';
import { getLayerByFeatureInCurrentProject } from '../../../gis/layers/layers.utils';
import { GeometryType, WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { projections } from '../../../geoserver/projections.service';
import { schemaService } from '../../../data/schema/schema.service';
import { PropertyType } from '../../../data/schema/schema.models';
import { formPrompt } from '../../../utility-dialogs.service';
import { PrintTemplate } from '../PrintTemplate';
import { PrintMapImageControl } from '../../../../components/PrintMapImageControl/PrintMapImageControl';

const MAX_COORDINATES = 30;

export const featureExtract: PrintTemplate<WfsFeature> = new PrintTemplate({
  name: 'featureExtract',
  title: 'Выписка об объекте',
  margin: [5, 10, 20, 10],
  orientation: 'portrait',
  format: 'a4',

  async render(this: PrintTemplate<WfsFeature>, entity: WfsFeature): Promise<string> {
    const layer = getLayerByFeatureInCurrentProject(entity);

    if (!layer) {
      throw new Error('Не найден слой для объекта');
    }

    const schema = await schemaService.getSchema(layer.schemaId);
    const schemaWithAppliedView = applyView(schema, layer.view);
    const { title } = getFeaturesListItemTitle(entity, schemaWithAppliedView);

    // карта
    const mapDialogResult = await formPrompt<{ title: string; image: string }>({
      title: 'Параметры печати',
      message: this.title,
      schema: {
        properties: [
          {
            name: 'title',
            propertyType: PropertyType.STRING,
            title: 'Название',
            defaultValue: title
          },
          {
            name: 'image',
            propertyType: PropertyType.CUSTOM,
            title: 'Карта',
            ControlComponent: PrintMapImageControl
          }
        ]
      }
    });

    if (!mapDialogResult) {
      return '';
    }

    // координаты
    let coordinatesFragment = '';
    if (
      // только один контур и не более 30 координат, иначе координаты не выводим
      entity.geometry?.coordinates &&
      !(
        (entity.geometry.type === GeometryType.MULTI_POINT || entity.geometry.type === GeometryType.LINE_STRING) &&
        entity.geometry.coordinates.length > MAX_COORDINATES
      ) &&
      !(
        (entity.geometry.type === GeometryType.MULTI_LINE_STRING || entity.geometry.type === GeometryType.POLYGON) &&
        (entity.geometry.coordinates.length > 1 || entity.geometry.coordinates[0]?.length > MAX_COORDINATES)
      ) &&
      !(
        entity.geometry.type === GeometryType.MULTI_POLYGON &&
        (entity.geometry.coordinates.length > 1 ||
          entity.geometry.coordinates[0]?.length > 1 ||
          entity.geometry.coordinates[0][0]?.length > MAX_COORDINATES)
      )
    ) {
      const coordinates: Coordinate[] = [];
      if (entity.geometry.type === GeometryType.POINT) {
        coordinates.push(entity.geometry.coordinates);
      }
      if (entity.geometry.type === GeometryType.MULTI_POINT) {
        coordinates.push(...entity.geometry.coordinates);
      }
      if (entity.geometry.type === GeometryType.POLYGON) {
        coordinates.push(...entity.geometry.coordinates[0]);
      }
      if (entity.geometry.type === GeometryType.MULTI_POLYGON) {
        coordinates.push(...entity.geometry.coordinates[0][0]);
      }
      const coordinatesRows = await Promise.all(
        coordinates.map(([x, y], n) => this.renderFragment('oneCoordinate', { n, x, y }))
      );
      const coordinatesRowsFragment = coordinatesRows.join('');
      coordinatesFragment = await this.renderFragment('coordinates', { coordinates: coordinatesRowsFragment });
    }

    // свойства
    const propertiesRows = await Promise.all(
      Object.entries(entity.properties)
        .map(([key, value]) => {
          const propertySchema = schema.properties.find(({ name }) => name === key);

          return {
            title: propertySchema?.title || key,
            value: getReadablePropertyValue(value, propertySchema)
          };
        })
        .filter(({ value }) => value)
        .map(async ({ title, value }) => {
          return await this.renderFragment('oneProperty', {
            title,
            value
          });
        })
    );

    return await this.renderFragment('main', {
      title: mapDialogResult.title,
      image: mapDialogResult.image,
      currentDate: moment().format('LL'),
      crs: projections.find(({ id }) => id === layer.nativeCRS)?.title || layer.nativeCRS,
      coordinates: coordinatesFragment,
      properties: propertiesRows.join(''),
      area: ''
    });
  },

  async getFileName(this: PrintTemplate<WfsFeature>, entity: WfsFeature) {
    const layer = getLayerByFeatureInCurrentProject(entity);

    if (!layer) {
      throw new Error('Не найден слой для объекта');
    }

    const schema = await schemaService.getSchema(layer.schemaId);
    const schemaWithAppliedView = applyView(schema, layer.view);

    const { title } = getFeaturesListItemTitle(entity, schemaWithAppliedView);

    return `${title} [${this.title}]`;
  }
});
