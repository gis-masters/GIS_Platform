import { getFileDownloadUrl } from '../data/files/files.service';
import { type LibraryRecord } from '../data/library/library.models';
import { type WfsFeature } from '../geoserver/wfs/wfs.models';
import { downloadByUrl } from '../util/FileSaver';
import { reportClient } from './report.client';
import { type CreateReportRequest } from './report.models';
import { rawDocumentData } from './templates/document/rawDocumentData';
import { featureExtract } from './templates/feature/featureExtract';
import { rawFeatureData } from './templates/feature/rawFeatureData';
import { situationalPlan } from './templates/featuresCollection/situationalPlan';
import { type PrintTemplate } from './templates/PrintTemplate';
import { prepareReportData } from './utils/prepareReportData';

export const documentPrintTemplates: PrintTemplate<LibraryRecord>[] = [rawDocumentData];
export const featurePrintTemplates: PrintTemplate<WfsFeature>[] = [rawFeatureData, featureExtract];
export const featuresCollectionPrintTemplates: PrintTemplate<WfsFeature[]>[] = [situationalPlan];

export async function printDocument(document: LibraryRecord, templateName: string): Promise<void> {
  const template = documentPrintTemplates.find(({ name }) => name === templateName);

  if (!template) {
    throw `Не найден шаблон печати "${templateName}"`;
  }

  await template.print(document);
}

/**
 * Генерирует отчёт через report-service (Carbon).
 * Base64-картинки из `data` автоматически выносятся в `media`.
 * Если передан `fileName`, файл автоматически скачивается пользователю через браузер.
 * @returns Идентификатор сгенерированного файла.
 */
export async function printWithCarbon(
  data: Record<string, unknown>,
  templateName: string,
  outputFormat: CreateReportRequest['outputFormat'],
  fileName?: string
): Promise<string> {
  const { data: preparedData, media } = prepareReportData(data);

  const fileId = await reportClient.createReport({
    outputFormat,
    templateName,
    media,
    data: preparedData
  });

  if (fileName) {
    await downloadByUrl(getFileDownloadUrl(fileId), fileName);
  }

  return fileId;
}
