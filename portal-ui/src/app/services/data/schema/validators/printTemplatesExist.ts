import { getTemplate } from '../../../reportTemplate/reportTemplate.service';
import { isAxiosError } from '../../../util/typeGuards/isAxiosError';
import { type Schema } from '../schema.models';
import { collectPrintTemplateNames } from '../utils/collectPrintTemplateNames';

export async function printTemplatesExist(schema: Schema): Promise<string[]> {
  const names = collectPrintTemplateNames(schema);
  if (!names.length) {
    return [];
  }

  const warnings: string[] = [];

  for (const name of names) {
    try {
      await getTemplate(name);
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      if (status === 404) {
        warnings.push(`Шаблон печати с именем '${name}' не существует`);
      } else {
        warnings.push(`Не удалось проверить шаблон печати '${name}'`);
      }
    }
  }

  return warnings;
}
