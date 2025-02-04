import { LibraryRecord } from '../data/library/library.models';
import { WfsFeature } from '../geoserver/wfs/wfs.models';
import { rawDocumentData } from './templates/document/rawDocumentData';
import { featureExtract } from './templates/feature/featureExtract';
import { rawFeatureData } from './templates/feature/rawFeatureData';
import { situationalPlan } from './templates/featuresCollection/situationalPlan';
import { PrintTemplate } from './templates/PrintTemplate';

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
