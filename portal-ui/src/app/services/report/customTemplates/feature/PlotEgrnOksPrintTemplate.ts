import moment from 'moment';

import { getFeaturesListItemTitle } from '../../../../components/FeaturesListItem/FeaturesListItem.util';
import { PrintFormatSubmitButton } from '../../../../components/PrintFormatSubmitButton/PrintFormatSubmitButton';
import { PrintMapImageControl } from '../../../../components/PrintMapImageControl/PrintMapImageControl';
import { Toast } from '../../../../components/Toast/Toast';
import { doFormPrompt } from '../../../answer-modals.service';
import { flags } from '../../../common/feature-flags/feature-flags.service';
import { getProjectionByCode } from '../../../data/projections/projections.service';
import { getProjectionUnit } from '../../../data/projections/projections.util';
import { PropertyType } from '../../../data/schema/schema.models';
import { getReadablePropertyValue } from '../../../data/schema/utils/getReadablePropertyValue';
import { type WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { type CrgVectorLayer } from '../../../gis/layers/layers.models';
import { FeaturePrintTemplate } from '../../baseTemplates/FeaturePrintTemplate';
import { getOksIntersectionsForPlotPrint } from '../../helpers/getOksIntersectionsForPlotPrint';
import { type OksIntersectionPrintItem } from '../../helpers/oksIntersectionPrint.models';
import {
  type CreateReportRequest,
  type FeatureTemplateData,
  isOutputFormat,
  type PrintPreparedData
} from '../../report.models';
import { getFeatureSize } from '../../utils/getFeatureSize';

type PlotEgrnOksPrintTemplateData = FeatureTemplateData & {
  oks: OksIntersectionPrintItem[];
};

export class PlotEgrnOksPrintTemplate extends FeaturePrintTemplate {
  override async getData(feature: WfsFeature): Promise<PrintPreparedData | void> {
    const schemaWithAppliedView = await this.getLayerSchemaWithAppliedView(feature);
    const layer = this.getLayerByFeature(feature);
    const { title: featureTitle } = getFeaturesListItemTitle(feature, schemaWithAppliedView);

    const submitData: { outputFormat: CreateReportRequest['outputFormat'] } = { outputFormat: 'DOCX' };

    let sourceLayer: CrgVectorLayer;

    try {
      sourceLayer = this.getLayerByFeature(feature);
    } catch (error) {
      Toast.warn(error instanceof Error ? error.message : 'Не удалось определить слой объекта');

      return;
    }

    const oksResult = await getOksIntersectionsForPlotPrint(feature, sourceLayer, {
      skipAreaComputation: true
    });

    if (!oksResult.ok) {
      Toast.warn(oksResult.message);

      return;
    }

    const oks = oksResult.items;

    const { formValue: mapDialogResult, extra } = await doFormPrompt<{
      map: string;
    }>({
      title: 'Параметры печати',
      message: this.title,
      SubmitComponent: PrintFormatSubmitButton,
      submitData,
      schema: {
        properties: [
          {
            name: 'map',
            propertyType: PropertyType.CUSTOM,
            title: 'Карта',
            ControlComponent: PrintMapImageControl,
            focusFeature: feature,
            autoGenerate: Boolean(flags.featureExtractPrintAutoMap),
            showSelectionInPrintByDefault: true,
            hideLegendInPrintByDefault: true
          }
        ]
      }
    });

    if (!mapDialogResult) {
      return;
    }

    const outputFormat: CreateReportRequest['outputFormat'] = isOutputFormat(extra?.outputFormat)
      ? extra.outputFormat
      : 'DOCX';

    const attributes = Object.entries(feature.properties)
      .map(([key, value]) => {
        const propertySchema = schemaWithAppliedView.properties.find(({ name }) => name === key);

        if (propertySchema?.hidden) {
          return { title: '', value: '' };
        }

        return {
          title: propertySchema?.title || key,
          value: getReadablePropertyValue(value, propertySchema)
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

    const templateData: PlotEgrnOksPrintTemplateData = {
      title: featureTitle,
      map: mapDialogResult.map,
      currentDate: moment().format('LL'),
      crs: projection?.title || layer.nativeCRS,
      size,
      attributes,
      feature,
      oks
    };

    return {
      outputFormat,
      templateData
    };
  }
}
