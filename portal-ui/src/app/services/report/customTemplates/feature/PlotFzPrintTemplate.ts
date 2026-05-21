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
import { enrichFzIntersectionsWithReadableCodes } from '../../helpers/enrichFzIntersectionsWithReadableCodes';
import { getFunctionalZonesIntersectionsForPlotPrint } from '../../helpers/getFunctionalZonesIntersectionsForPlotPrint';
import { resolvePlotDataDateFromSourceDoc } from '../../helpers/resolvePlotDataDateFromSourceDoc';
import {
  type CreateReportRequest,
  type FzIntersectionPrintItem,
  isOutputFormat,
  type PrintPreparedData
} from '../../report.models';

type PlotFzPrintTemplateData = {
  title: string;
  map: string;
  dataDate: string;
  feature: WfsFeature;
  fz: FzIntersectionPrintItem[];
};

/** Печать по участку: пересечения с функциональными зонами (`sys_plot_fz`). */
export class PlotFzPrintTemplate extends FeaturePrintTemplate {
  override async getData(feature: WfsFeature): Promise<PrintPreparedData | void> {
    const schemaWithAppliedView = await this.getLayerSchemaWithAppliedView(feature);
    const { title: featureTitle } = getFeaturesListItemTitle(feature, schemaWithAppliedView);

    const submitData: { outputFormat: CreateReportRequest['outputFormat'] } = { outputFormat: 'DOCX' };

    let sourceLayer: CrgVectorLayer;

    try {
      sourceLayer = this.getLayerByFeature(feature);
    } catch (error) {
      Toast.warn(error instanceof Error ? error.message : 'Не удалось определить слой объекта');

      return;
    }

    const fzResult = await getFunctionalZonesIntersectionsForPlotPrint(feature, sourceLayer);

    if (!fzResult.ok) {
      Toast.warn(fzResult.message);

      return;
    }

    const fzEnriched: FzIntersectionPrintItem[] = await enrichFzIntersectionsWithReadableCodes(fzResult.items);

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

    const dataDate = await resolvePlotDataDateFromSourceDoc(feature);

    const templateData: PlotFzPrintTemplateData = {
      title: featureTitle,
      map: mapDialogResult.map,
      dataDate,
      feature,
      fz: fzEnriched
    };

    console.log('templateData', templateData); // eslint-disable-line no-console -- не забыть удалить

    return {
      outputFormat,
      templateData
    };
  }
}
