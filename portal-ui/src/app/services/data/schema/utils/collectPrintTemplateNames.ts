import { type Schema } from '../schema.models';

export function collectPrintTemplateNames(schema: Schema): string[] {
  const names = new Set<string>(schema.printTemplates);

  schema.views?.forEach(view => {
    view.printTemplates?.forEach(n => names.add(n));
  });
  schema.contentTypes?.forEach(ct => {
    ct.printTemplates?.forEach(n => names.add(n));
  });

  return [...names];
}
