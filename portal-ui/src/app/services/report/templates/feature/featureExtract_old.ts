import moment from 'moment';
import { type Coordinate } from 'ol/coordinate';

import { getFeaturesListItemTitle } from '../../../../components/FeaturesListItem/FeaturesListItem.util';
import { PrintMapImageControl } from '../../../../components/PrintMapImageControl/PrintMapImageControl';
import { SelectPropertiesControl } from '../../../../components/SelectPropertiesControl/SelectPropertiesControl';
import { doFormPrompt } from '../../../answer-modals.service';
import { flags } from '../../../common/feature-flags/feature-flags.service';
import { getProjectionByCode } from '../../../data/projections/projections.service';
import { getProjectionUnit } from '../../../data/projections/projections.util';
import { type PropertySchema, PropertyType } from '../../../data/schema/schema.models';
import { applyView, getReadablePropertyValue } from '../../../data/schema/schema.utils';
import { GeometryType, type WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { getLayerSchema } from '../../../gis/layers/layers.service';
import { getLayerByFeatureInCurrentProject } from '../../../gis/layers/layers.utils';
import { getFeatureSize } from '../../utils/getFeatureSize';
import { PrintTemplate } from '../PrintTemplate';

// Максимальное количество координат для отображения
const MAX_COORDINATES = 20;

export const featureExtractOld: PrintTemplate<WfsFeature> = new PrintTemplate({
  name: 'featureExtractOld',
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
    const { formValue: mapDialogResult } = await doFormPrompt<{
      title: string;
      image: string;
      properties: PropertySchema[];
    }>({
      title: 'Параметры печати',
      message: this.title,
      submitProps: { children: 'Печать (PDF)' },
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
            ControlComponent: PrintMapImageControl,
            focusFeature: entity,
            autoGenerate: Boolean(flags.featureExtractPrintAutoMap)
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
    let polygonSeparators: number[] = [];
    let polygonStartIndices: number[] = [0];
    // номера первых точек каждого полигона
    const polygonFirstPointNumbers: Map<number, number> = new Map();
    const allCoordinates: Coordinate[] = [];

    const isPolygonType =
      entity.geometry?.type === GeometryType.POLYGON || entity.geometry?.type === GeometryType.MULTI_POLYGON;

    if (entity.geometry?.coordinates) {
      // Извлечение координат в зависимости от типа геометрии
      if (entity.geometry.type === GeometryType.POINT) {
        allCoordinates.push(entity.geometry.coordinates);
      }

      if (entity.geometry.type === GeometryType.MULTI_POINT || entity.geometry.type === GeometryType.LINE_STRING) {
        allCoordinates.push(...entity.geometry.coordinates);
      }

      if (entity.geometry.type === GeometryType.POLYGON || entity.geometry.type === GeometryType.MULTI_LINE_STRING) {
        let totalPoints = 0;

        for (let ringIndex = 0; ringIndex < entity.geometry.coordinates.length; ringIndex++) {
          const ring = entity.geometry.coordinates[ringIndex];

          allCoordinates.push(...ring);
          totalPoints += ring.length;

          if (ringIndex < entity.geometry.coordinates.length - 1) {
            polygonSeparators.push(totalPoints);
            // начало следующего полигона
            polygonStartIndices.push(totalPoints);
          }
        }
      }

      if (entity.geometry.type === GeometryType.MULTI_POLYGON) {
        let totalPoints = 0;
        polygonSeparators = [];
        polygonStartIndices = [0];

        for (let polygonIndex = 0; polygonIndex < entity.geometry.coordinates.length; polygonIndex++) {
          const polygon = entity.geometry.coordinates[polygonIndex];

          for (let ringIndex = 0; ringIndex < polygon.length; ringIndex++) {
            const ring = polygon[ringIndex];

            allCoordinates.push(...ring);
            totalPoints += ring.length;

            if (!(polygonIndex === entity.geometry.coordinates.length - 1 && ringIndex === polygon.length - 1)) {
              polygonSeparators.push(totalPoints);
              polygonStartIndices.push(totalPoints); // Запоминаем начало следующего полигона
            }
          }
        }
      }

      // проставляем последний индекс как конечный
      polygonStartIndices.push(allCoordinates.length);

      // номера первых точек каждого полигона
      let currentNumber = 1;
      for (let i = 0; i < polygonStartIndices.length - 1; i++) {
        const startIndex = polygonStartIndices[i];
        polygonFirstPointNumbers.set(startIndex, currentNumber);
        // -1 потому что последняя точка будет использовать номер первой (только для полигонов)
        const pointsInPolygon = polygonStartIndices[i + 1] - polygonStartIndices[i];
        currentNumber += isPolygonType ? pointsInPolygon - 1 : pointsInPolygon;
      }

      hasManyCoordinates = allCoordinates.length > MAX_COORDINATES;

      // получение номера точки
      const getPointNumber = (index: number): number => {
        let polygonStart = 0;
        for (let i = 0; i < polygonStartIndices.length - 1; i++) {
          if (index >= polygonStartIndices[i] && index < polygonStartIndices[i + 1]) {
            polygonStart = polygonStartIndices[i];
            break;
          }
        }

        // если это последняя точка полигона И тип геометрии - полигон, возвращаем номер первой точки этого полигона
        if (isPolygonType && index === polygonStartIndices[polygonStartIndices.indexOf(polygonStart) + 1] - 1) {
          return polygonFirstPointNumbers.get(polygonStart) || 1;
        }

        // иначе вычисляем обычный номер
        const firstPointNumber = polygonFirstPointNumbers.get(polygonStart) || 1;

        return firstPointNumber + (index - polygonStart);
      };

      const getFirstPointOfPolygon = (index: number): Coordinate => {
        for (let i = 0; i < polygonStartIndices.length - 1; i++) {
          if (index >= polygonStartIndices[i] && index < polygonStartIndices[i + 1]) {
            return allCoordinates[polygonStartIndices[i]];
          }
        }

        return allCoordinates[index];
      };

      if (hasManyCoordinates) {
        // Формирование таблицы координат для шаблона mainWithAllCoord
        const colsCount = 3;
        const rowsPerCol = Math.ceil(allCoordinates.length / colsCount);

        // Сборка элементов по колонкам
        type ColItem = { type: 'sep' } | { type: 'coord'; abs: number; x: number; y: number; pointNumber: number };

        const colItems: ColItem[][] = Array.from({ length: colsCount }, () => []);

        for (let col = 0; col < colsCount; col++) {
          for (let r = 0; r < rowsPerCol; r++) {
            const idx = r + col * rowsPerCol;
            if (idx >= allCoordinates.length) {
              break;
            }

            const absoluteIndex = idx;
            // если перед этой координатой должен быть разделитель — кладём 'sep' перед ней
            if (polygonSeparators.includes(absoluteIndex)) {
              colItems[col].push({ type: 'sep' });
            }

            let displayX;
            let displayY;

            const pointNumber = getPointNumber(absoluteIndex);

            // замена последней точки в полигоне - ТОЛЬКО ДЛЯ ТИПОВ POLYGON И MULTI_POLYGON
            const polygonStart = polygonStartIndices.find(
              (start, i) => absoluteIndex >= start && absoluteIndex < polygonStartIndices[i + 1]
            );

            if (
              isPolygonType &&
              polygonStart !== undefined &&
              absoluteIndex === polygonStartIndices[polygonStartIndices.indexOf(polygonStart) + 1] - 1
            ) {
              [displayX, displayY] = getFirstPointOfPolygon(absoluteIndex);
            } else {
              [displayX, displayY] = allCoordinates[absoluteIndex];
            }

            colItems[col].push({
              type: 'coord',
              abs: absoluteIndex,
              x: displayX,
              y: displayY,
              pointNumber
            });
          }
        }

        // максимальная высота среди колонок
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
              // Разделитель занимает только ширину колонки
              rowCells +=
                '<td colspan="3" style="text-align:center; padding:2px; color:grey; font-size:5px">--- --- ---</td>';
              continue;
            }

            rowCells += `<td style="color:grey; text-align:center">${item.pointNumber}</td>
                  <td style="padding:2px; text-align:center">${item.y}</td>
                  <td style="padding:2px; text-align:center">${item.x}</td>`;
          }

          rows.push(`<tr>${rowCells}</tr>`);
        }

        coordinatesRows = rows.join('');
      } else {
        const coordinatesRowsArray: string[] = [];

        for (const [i, [x, y]] of allCoordinates.entries()) {
          let displayX = x;
          let displayY = y;
          const pointNumber = getPointNumber(i);

          // Для последней точки в полигоне используем координаты первой точки этого полигона
          // ТОЛЬКО ДЛЯ POLYGON И MULTI_POLYGON
          const polygonStart = polygonStartIndices.find((start, idx) => i >= start && i < polygonStartIndices[idx + 1]);
          if (
            isPolygonType &&
            polygonStart !== undefined &&
            i === polygonStartIndices[polygonStartIndices.indexOf(polygonStart) + 1] - 1
          ) {
            [displayX, displayY] = getFirstPointOfPolygon(i);
          }

          // Проверяем, нужно ли вставить разделитель перед этой точкой
          if (polygonSeparators.includes(i)) {
            coordinatesRowsArray.push(`
          <tr>
            <td colspan="3" style="text-align: center; padding: 5px; color: grey;">
              --- --- ---
            </td>
          </tr>
        `);
          }

          coordinatesRowsArray.push(`
        <tr>
          <td style="color: grey; text-align: center">${pointNumber}</td>
          <td style="padding: 2px; text-align: center">${displayY}</td>
          <td style="padding: 2px; text-align: center">${displayX}</td>
        </tr>
      `);
        }

        coordinatesFragment = await this.renderFragment('coordinates', { coordinates: coordinatesRowsArray.join('') });
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

    const templateName = hasManyCoordinates ? 'mainWithAllCoord' : 'main';

    const templateData = {
      title: mapDialogResult.title,
      image: mapDialogResult.image,
      currentDate: moment().format('LL'),
      crs: projection ? projection.title : layer.nativeCRS,
      properties: propertiesRows.join(''),
      area: area
        ? await this.renderFragment('area', {
            areaSize: String(area.value),
            units: String(area.units),
            areaType: area.sizeType === 'area' ? 'Площадь' : 'Протяженность'
          })
        : ''
    };

    if (hasManyCoordinates) {
      if (!area?.value) {
        return await this.renderFragment(templateName, {
          ...templateData,
          coordinates: coordinatesRows
        });
      }

      return await this.renderFragment(templateName, {
        ...templateData,
        coordinates: coordinatesRows,
        areaSize: String(area.value),
        units: String(area.units),
        areaType: area.sizeType === 'area' ? 'Площадь' : 'Протяженность'
      });
    }

    return await this.renderFragment(templateName, {
      ...templateData,
      coordinates: coordinatesFragment
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
