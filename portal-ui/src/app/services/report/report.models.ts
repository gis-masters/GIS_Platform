import { type ReportMainDto } from '../../../server-types/common-contracts';
import { type WfsFeature } from '../geoserver/wfs/wfs.models';
import { type CrgLayer } from '../gis/layers/layers.models';
import { type PrintableCoordinatesChunk } from './utils/buildCoordinatesList';
import { type FeatureSize } from './utils/getFeatureSize';

export interface CreateReportRequest extends ReportMainDto {
  data: Record<string, unknown>;
}

export type PrintPreparedData = {
  outputFormat: CreateReportRequest['outputFormat'];
  templateData: unknown;
};

/** Минимальный контракт для UI печати (`PrintAction` и т.п.)
 *  Выпилить после выпиливания PrintTemplateOld
 */
export type PrintableTemplate<T> = {
  name: string;
  title: string;
  print(entity: T): Promise<void>;
};

/** Имена шаблонов печати объекта по умолчанию, если в схеме слоя нет `printTemplates` */
export const defaultFeaturePrintTemplateNames = ['sys_feature_extract'] as const;

export type FeatureAttribute = {
  title: string;
  value: string;
};

/** Элемент списка пересечений участка с другим векторным слоем для шаблонов печати. */
export type IntersectionPrintItem = {
  layer: CrgLayer;
  type: string;
  feature: WfsFeature;
  intersectionArea?: number;
  intersectionAreaPercent?: number;
};

/** Пересечение с функциональной зоной: плюс подписи classid/status по схеме слоя. */
export type FzIntersectionPrintItem = IntersectionPrintItem & {
  classidReadable: string;
  statusReadable: string;
};

/** Пересечение с границей НП (схема admenp_fgis): читаемый статус по полю status_adm. */
export type NpIntersectionPrintItem = IntersectionPrintItem & {
  statusAdmReadable: string;
};

export type FeatureTemplateData = {
  title: string;
  map: string;
  currentDate: string;
  crs: string;
  size?: FeatureSize;
  attributes: FeatureAttribute[];
  coordinatesList?: PrintableCoordinatesChunk[];
  feature: WfsFeature;
};
