import moment from 'moment';
import { Coordinate } from 'ol/coordinate';

import { getFeaturesListItemTitle } from '../../../../components/FeaturesListItem/FeaturesListItem.util';
import { PrintMapImageControl } from '../../../../components/PrintMapImageControl/PrintMapImageControl';
import { SelectPropertiesControl } from '../../../../components/SelectPropertiesControl/SelectPropertiesControl';
import { getProjectionByCode } from '../../../data/projections/projections.service';
import { getProjectionUnit } from '../../../data/projections/projections.util';
import { PropertySchema, PropertyType } from '../../../data/schema/schema.models';
import { applyView, getReadablePropertyValue } from '../../../data/schema/schema.utils';
import { GeometryType, WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { getLayerSchema } from '../../../gis/layers/layers.service';
import { getLayerByFeatureInCurrentProject } from '../../../gis/layers/layers.utils';
import { formPrompt } from '../../../utility-dialogs.service';
import { getFeatureSize } from '../../helpers/getFeatureSize';
import { PrintTemplate } from '../PrintTemplate';

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
      throw new Error('Не удалось извлечь фичу. Не найден слой для объекта');
    }

    const schema = await getLayerSchema(layer);
    if (!schema) {
      throw new Error(`Не удалось извлечь фичу. Не удалось получить схему слоя ${layer.title}`);
    }
    const schemaWithAppliedView = applyView(schema, layer.view);
    const { title } = getFeaturesListItemTitle(entity, schemaWithAppliedView);
    const properties = schemaWithAppliedView.properties.filter(({ hidden }) => !hidden);

    // карта
    const mapDialogResult = await formPrompt<{ title: string; image: string; properties: PropertySchema[] }>({
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
          },
          {
            name: 'properties',
            defaultValue: properties,
            propertyType: PropertyType.CUSTOM,
            ControlComponent: SelectPropertiesControl,
            properties,
            title: 'Выбор полей для печати'
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
        coordinates.map(([x, y], n) => this.renderFragment('oneCoordinate', { n: n + 1, x, y }))
      );
      const coordinatesRowsFragment = coordinatesRows.join('');
      coordinatesFragment = await this.renderFragment('coordinates', { coordinates: coordinatesRowsFragment });
    }

    // свойства
    const propertiesRows = await Promise.all(
      Object.entries(entity.properties)
        .map(([key, value]) => {
          const propertySchema = schema.properties.find(({ name }) => name === key);
          const disabled = propertySchema && !mapDialogResult.properties?.some(({ name }) => name === key);

          return {
            title: propertySchema?.title || key,
            value: disabled ? '' : getReadablePropertyValue(value, propertySchema)
          };
        })
        .filter(({ value }) => value)
        .map(async ({ title, value }) => {
          return await this.renderFragment('oneProperty', { title, value });
        })
    );

    const projection = await getProjectionByCode(layer.nativeCRS);

    if (!projection) {
      throw new Error('Отсутствует проекция');
    }

    const area = getFeatureSize({
      feature: entity,
      projection,
      units: projection ? getProjectionUnit(projection.srtext) : undefined
    });

    return await this.renderFragment('main', {
      title: mapDialogResult.title,
      image: mapDialogResult.image,
      currentDate: moment().format('LL'),
      crs: projection ? projection.title : layer.nativeCRS,
      coordinates: coordinatesFragment,
      properties: propertiesRows.join(''),
      area: area
        ? await this.renderFragment('area', {
            area: String(area.value),
            units: String(area.units),
            areaType: area.sizeType === 'area' ? 'Площадь' : 'Протяженность'
          })
        : ''
    });
  },

  async getFileName(this: PrintTemplate<WfsFeature>, entity: WfsFeature) {
    const layer = getLayerByFeatureInCurrentProject(entity);
    if (!layer) {
      throw new Error('Не удалось получить имя файла. Не найден слой для объекта');
    }

    const schema = await getLayerSchema(layer);
    if (!schema) {
      throw new Error(`Не удалось получить имя файла. Не удалось получить схему слоя ${layer.title}`);
    }

    const schemaWithAppliedView = applyView(schema, layer.view);
    const { title } = getFeaturesListItemTitle(entity, schemaWithAppliedView);

    return `${title} [${this.title}]`;
  }
});
