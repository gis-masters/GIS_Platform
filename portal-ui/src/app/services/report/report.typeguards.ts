import { type ReportOutputFormat } from '../../../server-types/common-contracts';

const OUTPUT_FORMATS = new Set<ReportOutputFormat>(['PDF', 'DOCX', 'ODT', 'JPEG']);

export function isOutputFormat(value: unknown): value is ReportOutputFormat {
  // as нужен, потому что Set.has() ожидает ReportOutputFormat; это безопасно, потому что .has() сам проверяет наличие
  return typeof value === 'string' && OUTPUT_FORMATS.has(value as ReportOutputFormat);
}
