import moment from 'moment';

import { getFeaturesListItemTitle } from '../../../components/FeaturesListItem/FeaturesListItem.util';
import { PrintFormatSubmitButton } from '../../../components/PrintFormatSubmitButton/PrintFormatSubmitButton';
import { PrintMapImageControl } from '../../../components/PrintMapImageControl/PrintMapImageControl';
import { SelectPropertiesControl } from '../../../components/SelectPropertiesControl/SelectPropertiesControl';
import { doFormPrompt } from '../../answer-modals.service';
import { flags } from '../../common/feature-flags/feature-flags.service';
import { getProjectionByCode } from '../../data/projections/projections.service';
import { getProjectionUnit } from '../../data/projections/projections.util';
import { type PropertySchema, PropertyType } from '../../data/schema/schema.models';
import { applyView, getReadablePropertyValue } from '../../data/schema/schema.utils';
import { type WfsFeature } from '../../geoserver/wfs/wfs.models';
import { getLayerSchema } from '../../gis/layers/layers.service';
import { getLayerByFeatureInCurrentProject } from '../../gis/layers/layers.utils';
import {
  type CreateReportRequest,
  type FeatureTemplateData,
  isOutputFormat,
  type PrintPreparedData
} from '../report.models';
import { buildCoordinatesList } from '../utils/buildCoordinatesList';
import { getFeatureSize } from '../utils/getFeatureSize';
import { PrintTemplate } from './PrintTemplate';

export class FeaturePrintTemplate extends PrintTemplate<WfsFeature> {
  override async getFileName(entity: WfsFeature): Promise<string> {
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

  override async getData(feature: WfsFeature): Promise<PrintPreparedData | void> {
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

    const submitData: { outputFormat: CreateReportRequest['outputFormat'] } = { outputFormat: 'PDF' };

    const { formValue: mapDialogResult, extra } = await doFormPrompt<{
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
            ControlComponent: PrintMapImageControl,
            focusFeature: feature,
            autoGenerate: Boolean(flags.featureExtractPrintAutoMap)
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

    const size =
      projection &&
      getFeatureSize({
        feature,
        projection,
        units: projection ? getProjectionUnit(projection.srtext) : undefined
      });

    const templateData: FeatureTemplateData = {
      title: mapDialogResult.title,
      map: mapDialogResult.map,
      currentDate: moment().format('LL'),
      crs: projection?.title || layer.nativeCRS,
      size,
      attributes,
      coordinatesList
    };

    return {
      outputFormat,
      templateData
    };
  }
}
