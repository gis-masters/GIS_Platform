import moment from 'moment';

import { getFeaturesListItemTitle } from '../../../../components/FeaturesListItem/FeaturesListItem.util';
import { PrintFormatSubmitButton } from '../../../../components/PrintFormatSubmitButton/PrintFormatSubmitButton';
import { PrintMapImageControl } from '../../../../components/PrintMapImageControl/PrintMapImageControl';
import { SelectPropertiesControl } from '../../../../components/SelectPropertiesControl/SelectPropertiesControl';
import { getProjectionByCode } from '../../../data/projections/projections.service';
import { getProjectionUnit } from '../../../data/projections/projections.util';
import { type PropertySchema, PropertyType } from '../../../data/schema/schema.models';
import { applyView, getReadablePropertyValue } from '../../../data/schema/schema.utils';
import { type WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { getLayerSchema } from '../../../gis/layers/layers.service';
import { getLayerByFeatureInCurrentProject } from '../../../gis/layers/layers.utils';
import { formPrompt } from '../../../utility-dialogs.service';
import { type CreateReportRequest, isOutputFormat } from '../../print.models';
import { printWithCarbon } from '../../print.service';
import { buildCoordinatesList, type PrintableCoordinatesChunk } from '../../utils/buildCoordinatesList';
import { type FeatureSize, getFeatureSize } from '../../utils/getFeatureSize';
import { isCompactGeometry } from '../../utils/isCompactGeometry';
import { PrintTemplate } from '../PrintTemplate';

type FeatureAttribute = {
  title: string;
  value: string;
};

type FeatureExtractTemplateData = {
  title: string;
  map: string;
  currentDate: string;
  crs: string;
  size?: FeatureSize;
  attributes: FeatureAttribute[];
  coordinatesList?: PrintableCoordinatesChunk[];
};

export const featureExtractNew: PrintTemplate<WfsFeature> = new PrintTemplate({
  name: 'featureExtractNew',
  title: 'Выписка об объекте',

  async render(this: PrintTemplate<WfsFeature>, feature: WfsFeature): Promise<string | void> {
    const layer = getLayerByFeatureInCurrentProject(feature);

    if (!layer) {
      throw new Error('Не удалось извлечь фичу. Не найден слой для объекта');
    }

    const schema = await getLayerSchema(layer);
    if (!schema) {
      throw new Error(`Не удалось извлечь фичу. Не удалось получить схему слоя ${layer.title}`);
    }

    const schemaWithAppliedView = applyView(schema, layer.view);
    const { title } = getFeaturesListItemTitle(feature, schemaWithAppliedView);
    const propertiesForSelect = schemaWithAppliedView.properties.filter(({ hidden }) => !hidden);

    // Диалог для настройки параметров печати
    const submitData: { outputFormat: CreateReportRequest['outputFormat'] } = { outputFormat: 'PDF' };

    const { formValue: mapDialogResult, extra } = await formPrompt<{
      title: string;
      map: string;
      properties: PropertySchema[];
    }>({
      title: 'Параметры печати',
      message: this.title,
      SubmitComponent: PrintFormatSubmitButton,
      submitData,
      schema: {
        properties: [
          {
            name: 'title',
            propertyType: PropertyType.STRING,
            title: 'Название',
            defaultValue: title
          },
          {
            name: 'map',
            propertyType: PropertyType.CUSTOM,
            title: 'Карта',
            ControlComponent: PrintMapImageControl
          },
          {
            name: 'properties',
            defaultValue: propertiesForSelect,
            propertyType: PropertyType.CUSTOM,
            ControlComponent: SelectPropertiesControl,
            properties: propertiesForSelect,
            title: 'Выбор полей для печати'
          }
        ]
      }
    });

    if (!mapDialogResult) {
      return;
    }

    const outputFormat: CreateReportRequest['outputFormat'] = isOutputFormat(extra?.outputFormat)
      ? extra.outputFormat
      : 'PDF';

    const coordinatesList = buildCoordinatesList(feature.geometry);
    const compact = mapDialogResult.map ? isCompactGeometry(feature.geometry, 20) : false;

    const attributes = Object.entries(feature.properties)
      .map(([key, value]) => {
        const propertySchema = schema.properties.find(({ name }) => name === key);
        const disabled = propertySchema && !mapDialogResult.properties?.some(({ name }) => name === key);

        return {
          title: propertySchema?.title || key,
          value: disabled ? '' : getReadablePropertyValue(value, propertySchema)
        };
      })
      .filter(({ value }) => value);
    const projection = await getProjectionByCode(layer.nativeCRS);

    // Расчет площади/протяженности объекта
    const size =
      projection &&
      getFeatureSize({
        feature,
        projection,
        units: projection ? getProjectionUnit(projection.srtext) : undefined
      });

    const templateName = compact ? 'featureExtractCompact' : 'featureExtractFull';

    const templateData: FeatureExtractTemplateData = {
      title: mapDialogResult.title,
      map: mapDialogResult.map,
      currentDate: moment().format('LL'),
      crs: projection?.title || layer.nativeCRS,
      size,
      attributes,
      coordinatesList
    };

    await printWithCarbon(templateData, templateName, outputFormat, await this.getFileName(feature));
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
