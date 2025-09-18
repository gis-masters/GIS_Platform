/* eslint-disable max-depth */
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

// Максимальное количество координат для отображения
const MAX_COORDINATES = 30;

export const featureExtract: PrintTemplate<WfsFeature> = new PrintTemplate({
  name: 'featureExtract',
  title: 'Выписка об объекте',
  margin: [5, 10, 20, 10], // Отступы: [верх, право, низ, лево] в мм
  orientation: 'portrait', // Ориентация страницы
  format: 'a4', // Формат бумаги

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

    // Диалог для настройки параметров печати
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

    // Обработка координат геометрии объекта
    let coordinatesFragment = '';
    let coordinatesRows = '';
    let hasManyCoordinates = false;

    if (entity.geometry?.coordinates) {
      const coordinates: Coordinate[] = [];
      let polygonSeparators: number[] = [];

      // Извлечение координат в зависимости от типа геометрии
      if (entity.geometry.type === GeometryType.POINT) {
        coordinates.push(entity.geometry.coordinates);
      }

      if (entity.geometry.type === GeometryType.MULTI_POINT || entity.geometry.type === GeometryType.LINE_STRING) {
        coordinates.push(...entity.geometry.coordinates);
      }

      if (entity.geometry.type === GeometryType.POLYGON || entity.geometry.type === GeometryType.MULTI_LINE_STRING) {
        let totalPoints = 0;

        for (let ringIndex = 0; ringIndex < entity.geometry.coordinates.length; ringIndex++) {
          const ring = entity.geometry.coordinates[ringIndex];

          coordinates.push(...ring);
          totalPoints += ring.length;

          if (ringIndex < entity.geometry.coordinates.length - 1) {
            polygonSeparators.push(totalPoints);
          }
        }
      }

      if (entity.geometry.type === GeometryType.MULTI_POLYGON) {
        let totalPoints = 0;
        polygonSeparators = [];

        for (let polygonIndex = 0; polygonIndex < entity.geometry.coordinates.length; polygonIndex++) {
          const polygon = entity.geometry.coordinates[polygonIndex];

          for (let ringIndex = 0; ringIndex < polygon.length; ringIndex++) {
            const ring = polygon[ringIndex];

            coordinates.push(...ring);
            totalPoints += ring.length;

            if (!(polygonIndex === entity.geometry.coordinates.length - 1 && ringIndex === polygon.length - 1)) {
              polygonSeparators.push(totalPoints);
            }
          }
        }
      }

      if (coordinates.length > MAX_COORDINATES) {
        hasManyCoordinates = true;

        // Первые MAX_COORDINATES координат на первой странице
        const firstPageCoordinates = coordinates.slice(0, MAX_COORDINATES);
        const firstPageRows: string[] = [];

        for (const [i, [x, y]] of firstPageCoordinates.entries()) {
          const globalIndex = i;

          // Проверяем, нужно ли вставить разделитель перед этой точкой
          if (polygonSeparators.includes(globalIndex)) {
            firstPageRows.push(`
              <tr>
                <td colspan="3" style="text-align: center; padding: 5px; color: grey;">
                  --- --- ---
                </td>
              </tr>
            `);
          }

          firstPageRows.push(`
            <tr>
              <td style="color: grey; text-align: center">${globalIndex + 1}</td>
              <td style="padding: 2px; text-align: center">${y}</td>
              <td style="padding: 2px; text-align: center">${x}</td>
            </tr>
          `);
        }

        coordinatesFragment = await this.renderFragment('coordinates', { coordinates: firstPageRows.join('') });

        const secondPageCoordinates = coordinates.slice(MAX_COORDINATES);
        const totalCoordinates = secondPageCoordinates.length;

        const colsCount = 3;
        const rowsPerCol = Math.ceil(totalCoordinates / colsCount);

        // Сборка «элементов» по колонкам: либо { type: 'sep' }, либо { type: 'coord', abs, x, y }
        type ColItem = { type: 'sep' } | { type: 'coord'; abs: number; x: number; y: number };

        const colItems: ColItem[][] = Array.from({ length: colsCount }, () => []);

        for (let col = 0; col < colsCount; col++) {
          for (let r = 0; r < rowsPerCol; r++) {
            const idx = r + col * rowsPerCol;
            if (idx >= totalCoordinates) {
              break;
            }

            const absoluteIndex = MAX_COORDINATES + idx;
            // если перед этой координатой должен быть разделитель — кладём 'sep' перед ней
            if (polygonSeparators.includes(absoluteIndex)) {
              colItems[col].push({ type: 'sep' });
            }

            const [x, y] = secondPageCoordinates[idx];
            colItems[col].push({ type: 'coord', abs: absoluteIndex, x, y });
          }
        }

        // максимальная высота среди колонок (с учётом вставленных разделителей)
        const maxLen = Math.max(...colItems.map(arr => arr.length));

        const rows: string[] = [];
        for (let i = 0; i < maxLen; i++) {
          let rowCells = '';

          for (let col = 0; col < colsCount; col++) {
            const item = colItems[col][i];

            if (!item) {
              // Пустые 3 ячейки для выравнивания колонки
              rowCells += '<td style="padding:2px"></td><td style="padding:2px"></td><td style="padding:2px"></td>';
              continue;
            }

            if (item.type === 'sep') {
              // Разделитель занимает только ширину колонки (3 ячейки этой колонки)
              rowCells +=
                '<td colspan="3" style="text-align:center; padding:2px; color:grey; font-size:5px">--- --- ---</td>';
              continue;
            }

            const n = item.abs + 1;
            rowCells += `<td style="color:grey; text-align:center">${n}</td>
                  <td style="padding:2px; text-align:center">${item.y}</td>
                  <td style="padding:2px; text-align:center">${item.x}</td>`;
          }

          rows.push(`<tr>${rowCells}</tr>`);
        }

        coordinatesRows = rows.join('');
      } else {
        const coordinatesRows: string[] = [];

        for (const [i, [x, y]] of coordinates.entries()) {
          // Проверяем, нужно ли вставить разделитель перед этой точкой
          if (polygonSeparators.includes(i)) {
            coordinatesRows.push(`
          <tr>
            <td colspan="3" style="text-align: center; padding: 5px; color: grey;">
              --- --- ---
            </td>
          </tr>
        `);
          }

          coordinatesRows.push(`
        <tr>
          <td style="color: grey; text-align: center">${i + 1}</td>
          <td style="padding: 2px; text-align: center">${y}</td>
          <td style="padding: 2px; text-align: center">${x}</td>
        </tr>
      `);
        }

        coordinatesFragment = await this.renderFragment('coordinates', { coordinates: coordinatesRows.join('') });
      }
    }

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

    // Расчет площади/протяженности объекта
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
        : '',
      hasManyCoordinates: hasManyCoordinates ? 'true' : '',
      coordinatesRows: coordinatesRows
    });
  },

  // Генерация имени файла для сохранения
  async getFileName(this: PrintTemplate<WfsFeature>, entity: WfsFeature) {
    const layer = getLayerByFeatureInCurrentProject(entity);
    if (!layer) {
      throw new Error('Не удалось получить имя файла. Не найден слой для объекта');
    }

    const schema = await getLayerSchema(layer);
    if (!schema) {
      throw new Error(`Не удалось получить имя файла. Не удалось получить схему слоя ${layer.title}`);
    }

    // Получение заголовка объекта для имени файла
    const schemaWithAppliedView = applyView(schema, layer.view);
    const { title } = getFeaturesListItemTitle(entity, schemaWithAppliedView);

    // Формат: "НазваниеОбъекта [Выписка об объекте]"
    return `${title} [${this.title}]`;
  }
});
