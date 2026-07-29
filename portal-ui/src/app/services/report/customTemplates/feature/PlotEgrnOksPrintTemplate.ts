import { getFeaturesListItemTitle } from '../../../../components/FeaturesListItem/FeaturesListItem.util';
import { PrintFormatSubmitButton } from '../../../../components/PrintFormatSubmitButton/PrintFormatSubmitButton';
import { PrintMapImageControl } from '../../../../components/PrintMapImageControl/PrintMapImageControl';
import { Toast } from '../../../../components/Toast/Toast';
import { doFormPrompt } from '../../../answer-modals.service';
import { flags } from '../../../common/feature-flags/feature-flags.service';
import { PropertyType } from '../../../data/schema/schema.models';
import { type WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { type CrgVectorLayer } from '../../../gis/layers/layers.models';
import { FeaturePrintTemplate } from '../../baseTemplates/FeaturePrintTemplate';
import { getOksIntersectionsForPlotPrint } from '../../helpers/getOksIntersectionsForPlotPrint';
import { resolveOksLayersBySchema } from '../../helpers/resolveOksLayersBySchema';
import { resolvePlotDataDateFromSourceDoc } from '../../helpers/resolvePlotDataDateFromSourceDoc';
import { type CreateReportRequest, type IntersectionPrintItem, type PrintPreparedData } from '../../report.models';
import { isOutputFormat } from '../../report.typeguards';

type PlotEgrnOksPrintTemplateData = {
  title: string;
  map: string;
  dataDate: string;
  feature: WfsFeature;
  oks: IntersectionPrintItem[];
};

/** Печать по участку: пересечения с ОКС (oks_pro, oks_polyline_pro, oks_constructions_points) (`sys_plot_egrn_oks`). */
export class PlotEgrnOksPrintTemplate extends FeaturePrintTemplate {
  override async getData(feature: WfsFeature): Promise<PrintPreparedData | void> {
    const schemaWithAppliedView = await this.getLayerSchemaWithAppliedView(feature);
    const { title: featureTitle } = getFeaturesListItemTitle(feature, schemaWithAppliedView);

    const submitData: { outputFormat: CreateReportRequest['outputFormat'] } = { outputFormat: 'DOCX' };

    let sourceLayer: CrgVectorLayer;

    try {
      sourceLayer = this.getVectorLayerByFeature(feature);
    } catch (error) {
      Toast.warn(error instanceof Error ? error.message : 'Не удалось определить слой объекта');

      return;
    }

    const oksResult = await getOksIntersectionsForPlotPrint(feature, sourceLayer);

    if (!oksResult.ok) {
      Toast.warn(oksResult.message);

      return;
    }

    const oks = oksResult.items;

    const oksLayersResult = await resolveOksLayersBySchema();
    const ensureVisibleLayers = oksLayersResult.ok ? Object.values(oksLayersResult.layers) : [];

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
            hideLegendInPrintByDefault: true,
            ensureVisibleLayers
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

    const dataDate = await resolvePlotDataDateFromSourceDoc(feature);

    const templateData: PlotEgrnOksPrintTemplateData = {
      title: featureTitle,
      map: mapDialogResult.map,
      dataDate,
      feature,
      oks
    };

    return {
      outputFormat,
      templateData
    };
  }
}
