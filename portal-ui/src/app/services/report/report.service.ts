import { type LibraryRecord } from '../data/library/library.models';
import { applyView } from '../data/schema/schema.utils';
import { type WfsFeature } from '../geoserver/wfs/wfs.models';
import { getLayerSchema } from '../gis/layers/layers.service';
import { getLayerByFeatureInCurrentProject } from '../gis/layers/layers.utils';
import { type TemplateInfo } from '../reportTemplate/reportTemplate.models';
import { getTemplate } from '../reportTemplate/reportTemplate.service';
import { FeaturePrintTemplate } from './baseTemplates/FeaturePrintTemplate';
import { FeatureExtractPrintTemplate } from './customTemplates/feature/FeatureExtractPrintTemplate';
import { rawDocumentData } from './oldTemplates/document/rawDocumentData';
import { situationalPlan } from './oldTemplates/featuresCollection/situationalPlan';
import { type PrintTemplateOld } from './oldTemplates/PrintTemplateOld';
import { defaultFeaturePrintTemplateNames } from './report.models';

const featurePrintCustomTemplateClasses: Record<string, new (info: TemplateInfo) => FeaturePrintTemplate> = {
  feature_extract: FeatureExtractPrintTemplate
};

export const documentPrintTemplates: PrintTemplateOld<LibraryRecord>[] = [rawDocumentData];
export const featuresCollectionPrintTemplates: PrintTemplateOld<WfsFeature[]>[] = [situationalPlan];

/**
 * Собирает шаблоны печати объекта: схема слоя, имена с бэка, инстансы классов.
 * При ошибке `getTemplate` — шаблон пропускается.
 */
export async function getFeaturePrintTemplates(feature: WfsFeature): Promise<FeaturePrintTemplate[]> {
  const layer = getLayerByFeatureInCurrentProject(feature);
  if (!layer) {
    return [];
  }
  const schema = await getLayerSchema(layer);
  if (!schema) {
    return [];
  }
  const schemaWithView = applyView(schema, layer.view);
  const names = schemaWithView.printTemplates?.length
    ? schemaWithView.printTemplates
    : [...defaultFeaturePrintTemplateNames];

  const out: FeaturePrintTemplate[] = [];

  for (const name of names) {
    let info: TemplateInfo;
    try {
      info = await getTemplate(name);
    } catch (error) {
      console.warn(`[getFeaturePrintTemplates] не удалось загрузить шаблон "${name}"`, error);
      continue;
    }
    const TemplateClass = featurePrintCustomTemplateClasses[name] ?? FeaturePrintTemplate;
    out.push(new TemplateClass(info));
  }

  return out;
}

export async function printDocument(document: LibraryRecord, templateName: string): Promise<void> {
  const template = documentPrintTemplates.find(({ name }) => name === templateName);

  if (!template) {
    throw new Error(`Не найден шаблон печати "${templateName}"`);
  }

  await template.print(document);
}
