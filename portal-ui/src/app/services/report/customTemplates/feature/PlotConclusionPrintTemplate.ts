import { getFeaturesListItemTitle } from '../../../../components/FeaturesListItem/FeaturesListItem.util';
import { PrintFormatSubmitButton } from '../../../../components/PrintFormatSubmitButton/PrintFormatSubmitButton';
import { PrintMapImageControl } from '../../../../components/PrintMapImageControl/PrintMapImageControl';
import { Toast } from '../../../../components/Toast/Toast';
import { doFormPrompt } from '../../../answer-modals.service';
import { flags } from '../../../common/feature-flags/feature-flags.service';
import { getProjectionByCode } from '../../../data/projections/projections.service';
import { PropertyType } from '../../../data/schema/schema.models';
import { type WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { type CrgVectorLayer } from '../../../gis/layers/layers.models';
import { FeaturePrintTemplate } from '../../baseTemplates/FeaturePrintTemplate';
import { enrichFzIntersectionsWithReadableCodes } from '../../helpers/enrichFzIntersectionsWithReadableCodes';
import { getFunctionalZonesIntersectionsForPlotPrint } from '../../helpers/getFunctionalZonesIntersectionsForPlotPrint';
import { getOksIntersectionsForPlotPrint } from '../../helpers/getOksIntersectionsForPlotPrint';
import { getZouitIntersectionsForPlotPrint } from '../../helpers/getZouitIntersectionsForPlotPrint';
import { resolveFunctionalZonesVectorLayerInProject } from '../../helpers/resolveFunctionalZonesVectorLayerInProject';
import { resolveOksLayersBySchema } from '../../helpers/resolveOksLayersBySchema';
import { resolvePlotDataDateFromSourceDoc } from '../../helpers/resolvePlotDataDateFromSourceDoc';
import {
  type CreateReportRequest,
  type FzIntersectionPrintItem,
  type IntersectionPrintItem,
  type PrintPreparedData
} from '../../report.models';
import { isOutputFormat } from '../../report.typeguards';
import { buildCoordinatesList, type PrintableCoordinatesChunk } from '../../utils/buildCoordinatesList';
import { getCadastralQuarter } from '../../utils/getCadastralQuarter';

type PlotConclusionPrintTemplateData = {
  title: string;
  crs: string;
  map: string;
  dataDate: string;
  cadastralQuarter?: string | null;
  feature: WfsFeature;
  oks: IntersectionPrintItem[];
  zouit: IntersectionPrintItem[];
  fz: FzIntersectionPrintItem[];
  showCoordinates: boolean;
  coordinatesList?: PrintableCoordinatesChunk[];
};

/** Печать заключения по земельному участку (`sys_plot_conclusion`). */
export class PlotConclusionPrintTemplate extends FeaturePrintTemplate {
  async getData(feature: WfsFeature): Promise<PrintPreparedData | void> {
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

    const [oksResult, zouitResult, fzResult] = await Promise.all([
      getOksIntersectionsForPlotPrint(feature, sourceLayer),
      getZouitIntersectionsForPlotPrint(feature, sourceLayer),
      getFunctionalZonesIntersectionsForPlotPrint(feature, sourceLayer)
    ]);

    if (!oksResult.ok) {
      Toast.warn(oksResult.message);

      return;
    }

    if (!zouitResult.ok) {
      Toast.warn(zouitResult.message);

      return;
    }

    if (!fzResult.ok) {
      Toast.warn(fzResult.message);

      return;
    }

    const oks = oksResult.items;
    const zouit = zouitResult.items;
    const fz = await enrichFzIntersectionsWithReadableCodes(fzResult.items);

    const [oksLayersResult, fzLayerResult] = await Promise.all([
      resolveOksLayersBySchema(),
      resolveFunctionalZonesVectorLayerInProject()
    ]);

    const ensureVisibleLayers: CrgVectorLayer[] = [
      ...(oksLayersResult.ok ? Object.values(oksLayersResult.layers) : []),
      ...(fzLayerResult.ok ? [fzLayerResult.layer] : [])
    ];

    const { formValue: mapDialogResult, extra } = await doFormPrompt<{
      map: string;
      showCoordinates: boolean;
    }>({
      title: 'Параметры отчёта',
      message: this.title,
      SubmitComponent: PrintFormatSubmitButton,
      submitData,
      schema: {
        properties: [
          {
            title: 'Карта',
            name: 'map',
            propertyType: PropertyType.CUSTOM,
            ControlComponent: PrintMapImageControl,
            focusFeature: feature,
            autoGenerate: Boolean(flags.featureExtractPrintAutoMap),
            showSelectionInPrintByDefault: true,
            hideLegendInPrintByDefault: true,
            ensureVisibleLayers
          },
          {
            name: 'showCoordinates',
            propertyType: PropertyType.BOOL,
            title: 'Выводить координаты',
            defaultValue: true
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

    const projection = await getProjectionByCode(layer.nativeCRS);
    const crs = projection?.title || layer.nativeCRS;

    const dataDate = await resolvePlotDataDateFromSourceDoc(feature);

    const templateData: PlotConclusionPrintTemplateData = {
      title: featureTitle,
      crs,
      map: mapDialogResult.map,
      dataDate,
      cadastralQuarter:
        typeof feature.properties.cadastralnum === 'string'
          ? getCadastralQuarter(feature.properties.cadastralnum)
          : undefined,
      feature,
      oks,
      zouit,
      fz,
      showCoordinates: mapDialogResult.showCoordinates,
      ...(mapDialogResult.showCoordinates ? { coordinatesList: buildCoordinatesList(feature.geometry) } : {})
    };

    return {
      outputFormat,
      templateData
    };
  }
}
