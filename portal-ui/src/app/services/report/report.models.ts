import { type ReportMainDto, type ReportOutputFormat } from '../../../server-types/common-contracts';
import { type PrintableCoordinatesChunk } from './utils/buildCoordinatesList';
import { type FeatureSize } from './utils/getFeatureSize';

const OUTPUT_FORMATS = new Set<ReportOutputFormat>(['PDF', 'DOCX', 'ODT', 'JPEG']);

export function isOutputFormat(value: unknown): value is ReportOutputFormat {
  // as нужен, потому что Set.has() ожидает ReportOutputFormat; это безопасно, потому что .has() сам проверяет наличие
  return typeof value === 'string' && OUTPUT_FORMATS.has(value as ReportOutputFormat);
}

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
export const defaultFeaturePrintTemplateNames = ['feature_extract'] as const;

export type FeatureAttribute = {
  title: string;
  value: string;
};

export type FeatureTemplateData = {
  title: string;
  map: string;
  currentDate: string;
  crs: string;
  size?: FeatureSize;
  attributes: FeatureAttribute[];
  coordinatesList?: PrintableCoordinatesChunk[];
};
