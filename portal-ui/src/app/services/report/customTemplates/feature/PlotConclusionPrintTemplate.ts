import { getFeaturesListItemTitle } from '../../../../components/FeaturesListItem/FeaturesListItem.util';
import { PrintFormatSubmitButton } from '../../../../components/PrintFormatSubmitButton/PrintFormatSubmitButton';
import { PrintMapImageControl } from '../../../../components/PrintMapImageControl/PrintMapImageControl';
import { Toast } from '../../../../components/Toast/Toast';
import { globalLoadingStore } from '../../../../stores/GlobalLoading.store';
import { doFormPrompt } from '../../../answer-modals.service';
import { flags } from '../../../common/feature-flags/feature-flags.service';
import { getProjectionByCode } from '../../../data/projections/projections.service';
import { PropertyType } from '../../../data/schema/schema.models';
import { type WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { type CrgVectorLayer } from '../../../gis/layers/layers.models';
import { type FieldValidator } from '../../../util/form/formValidation.utils';
import { FeaturePrintTemplate } from '../../baseTemplates/FeaturePrintTemplate';
import { enrichFzIntersectionsWithReadableCodes } from '../../helpers/enrichFzIntersectionsWithReadableCodes';
import { enrichNpIntersectionsWithReadableCodes } from '../../helpers/enrichNpIntersectionsWithReadableCodes';
import { getFunctionalZonesIntersectionsForPlotPrint } from '../../helpers/getFunctionalZonesIntersectionsForPlotPrint';
import { getNpIntersectionsForPlotPrint, NP_LAYER_SCHEMA_NAME } from '../../helpers/getNpIntersectionsForPlotPrint';
import { getOksIntersectionsForPlotPrint } from '../../helpers/getOksIntersectionsForPlotPrint';
import { getZouitIntersectionsForPlotPrint } from '../../helpers/getZouitIntersectionsForPlotPrint';
import { resolveFunctionalZonesVectorLayerInProject } from '../../helpers/resolveFunctionalZonesVectorLayerInProject';
import { resolveSingleLayerBySchema } from '../../helpers/resolveLayersBySchema';
import { resolveOksLayersBySchema } from '../../helpers/resolveOksLayersBySchema';
import { resolvePlotDataDateFromSourceDoc } from '../../helpers/resolvePlotDataDateFromSourceDoc';
import { resolveZouitVectorLayerInProject } from '../../helpers/resolveZouitVectorLayerInProject';
import {
  type CreateReportRequest,
  type FzIntersectionPrintItem,
  type IntersectionPrintItem,
  type NpIntersectionPrintItem,
  type PrintPreparedData
} from '../../report.models';
import { isOutputFormat } from '../../report.typeguards';
import { buildCoordinatesList, type PrintableCoordinatesChunk } from '../../utils/buildCoordinatesList';
import { getCadastralQuarter } from '../../utils/getCadastralQuarter';

type PlotConclusionPrintFormValue = {
  map: string;
  showCoordinates: boolean;
  showOks: boolean;
  showZouit: boolean;
  showFz: boolean;
  showNp: boolean;
};

type PlotConclusionSectionLayers = {
  oksLayersResult: Awaited<ReturnType<typeof resolveOksLayersBySchema>>;
  zouitLayerResult: Awaited<ReturnType<typeof resolveZouitVectorLayerInProject>>;
  fzLayerResult: Awaited<ReturnType<typeof resolveFunctionalZonesVectorLayerInProject>>;
  npLayerResult: Awaited<ReturnType<typeof resolveSingleLayerBySchema>>;
};

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
  np: NpIntersectionPrintItem[];
  showCoordinates: boolean;
  showOks: boolean;
  showZouit: boolean;
  showFz: boolean;
  showNp: boolean;
  coordinatesList?: PrintableCoordinatesChunk[];
};

type PlotConclusionSectionIntersections = Pick<PlotConclusionPrintTemplateData, 'oks' | 'zouit' | 'fz' | 'np'>;

const sectionWarning =
  (message?: string): FieldValidator =>
  value =>
    value === true && message ? [message] : undefined;

async function loadSectionIntersections<TItem>(
  enabled: boolean,
  layerAvailable: boolean,
  load: () => Promise<{ ok: true; items: TItem[] } | { ok: false; message: string }>
): Promise<TItem[] | void>;

async function loadSectionIntersections<TItem, TResult>(
  enabled: boolean,
  layerAvailable: boolean,
  load: () => Promise<{ ok: true; items: TItem[] } | { ok: false; message: string }>,
  enrich: (items: TItem[]) => Promise<TResult[]>
): Promise<TResult[] | void>;

async function loadSectionIntersections<TItem, TResult>(
  enabled: boolean,
  layerAvailable: boolean,
  load: () => Promise<{ ok: true; items: TItem[] } | { ok: false; message: string }>,
  enrich?: (items: TItem[]) => Promise<TResult[]>
): Promise<TItem[] | TResult[] | void> {
  if (!enabled || !layerAvailable) {
    return [];
  }

  const result = await load();

  if (!result.ok) {
    Toast.warn(result.message);

    return;
  }

  if (enrich) {
    return enrich(result.items);
  }

  return result.items;
}

async function loadPlotConclusionSectionIntersections(
  feature: WfsFeature,
  sourceLayer: CrgVectorLayer,
  formValue: PlotConclusionPrintFormValue,
  sectionLayers: PlotConclusionSectionLayers
): Promise<PlotConclusionSectionIntersections | void> {
  // oks нужны и в первом разделе (кадастровые номера ОКС на участке), не только в разделе showOks
  const oks = await loadSectionIntersections(true, sectionLayers.oksLayersResult.ok, () =>
    getOksIntersectionsForPlotPrint(feature, sourceLayer)
  );

  if (!oks) {
    return;
  }

  const zouit = await loadSectionIntersections(formValue.showZouit, sectionLayers.zouitLayerResult.ok, () =>
    getZouitIntersectionsForPlotPrint(feature, sourceLayer)
  );

  if (!zouit) {
    return;
  }

  const fz = await loadSectionIntersections(
    formValue.showFz,
    sectionLayers.fzLayerResult.ok,
    () => getFunctionalZonesIntersectionsForPlotPrint(feature, sourceLayer),
    enrichFzIntersectionsWithReadableCodes
  );

  if (!fz) {
    return;
  }

  const np = await loadSectionIntersections(
    formValue.showNp,
    sectionLayers.npLayerResult.ok,
    () => getNpIntersectionsForPlotPrint(feature, sourceLayer),
    enrichNpIntersectionsWithReadableCodes
  );

  if (!np) {
    return;
  }

  return { oks, zouit, fz, np };
}

function buildEnsureVisibleLayers(sectionLayers: PlotConclusionSectionLayers): CrgVectorLayer[] {
  const { oksLayersResult, zouitLayerResult, fzLayerResult, npLayerResult } = sectionLayers;

  return [
    ...(oksLayersResult.ok ? Object.values(oksLayersResult.layers) : []),
    ...(zouitLayerResult.ok ? [zouitLayerResult.layer] : []),
    ...(fzLayerResult.ok ? [fzLayerResult.layer] : []),
    ...(npLayerResult.ok ? [npLayerResult.layer] : [])
  ];
}

/** Печать заключения по земельному участку (`sys_plot_conclusion`). */
export class PlotConclusionPrintTemplate extends FeaturePrintTemplate {
  override async print(entity: WfsFeature): Promise<void> {
    try {
      await super.print(entity);
    } finally {
      globalLoadingStore.finish();
    }
  }

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

    const [oksLayersResult, zouitLayerResult, fzLayerResult, npLayerResult] = await Promise.all([
      resolveOksLayersBySchema(),
      resolveZouitVectorLayerInProject(),
      resolveFunctionalZonesVectorLayerInProject(),
      resolveSingleLayerBySchema(NP_LAYER_SCHEMA_NAME)
    ]);

    const sectionLayers: PlotConclusionSectionLayers = {
      oksLayersResult,
      zouitLayerResult,
      fzLayerResult,
      npLayerResult
    };

    const { formValue: mapDialogResult, extra } = await doFormPrompt<PlotConclusionPrintFormValue>({
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
            ensureVisibleLayers: buildEnsureVisibleLayers(sectionLayers)
          },
          {
            name: 'showCoordinates',
            propertyType: PropertyType.BOOL,
            title: 'Выводить координаты',
            defaultValue: true
          },
          {
            name: 'showOks',
            propertyType: PropertyType.BOOL,
            title: 'Выводить раздел ОКС',
            defaultValue: true,
            warningFormula: sectionWarning(
              sectionLayers.oksLayersResult.ok ? undefined : sectionLayers.oksLayersResult.message
            )
          },
          {
            name: 'showZouit',
            propertyType: PropertyType.BOOL,
            title: 'Выводить раздел ЗОУИТ',
            defaultValue: true,
            warningFormula: sectionWarning(
              sectionLayers.zouitLayerResult.ok ? undefined : sectionLayers.zouitLayerResult.message
            )
          },
          {
            name: 'showFz',
            propertyType: PropertyType.BOOL,
            title: 'Выводить раздел функциональных зон',
            defaultValue: true,
            warningFormula: sectionWarning(
              sectionLayers.fzLayerResult.ok ? undefined : sectionLayers.fzLayerResult.message
            )
          },
          {
            name: 'showNp',
            propertyType: PropertyType.BOOL,
            title: 'Выводить раздел о границах населённого пункта',
            defaultValue: false,
            warningFormula: sectionWarning(
              sectionLayers.npLayerResult.ok ? undefined : sectionLayers.npLayerResult.message
            )
          }
        ]
      }
    });

    if (!mapDialogResult) {
      return;
    }

    globalLoadingStore.start();

    const outputFormat: CreateReportRequest['outputFormat'] = isOutputFormat(extra?.outputFormat)
      ? extra.outputFormat
      : 'DOCX';

    const sectionIntersections = await loadPlotConclusionSectionIntersections(
      feature,
      sourceLayer,
      mapDialogResult,
      sectionLayers
    );

    if (!sectionIntersections) {
      return;
    }

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
      ...sectionIntersections,
      showCoordinates: mapDialogResult.showCoordinates,
      showOks: mapDialogResult.showOks,
      showZouit: mapDialogResult.showZouit,
      showFz: mapDialogResult.showFz,
      showNp: mapDialogResult.showNp,
      ...(mapDialogResult.showCoordinates ? { coordinatesList: buildCoordinatesList(feature.geometry) } : {})
    };

    return {
      outputFormat,
      templateData
    };
  }
}
