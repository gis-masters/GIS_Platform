import { type SchemaTemplateWithOldSchema } from '../../../src/app/services/data/schemaTemplate/schemaTemplate.models';
import { schemas } from './schemas';

const TEMPLATE_AUTHOR = 'arh_grad_rk@mail.ru';

export function getSchemaTemplates(): SchemaTemplateWithOldSchema[] {
  return schemas.map((classRule, index) => ({
    id: index + 1,
    name: classRule.name,
    classRule,
    customRule: '',
    calculatedFields: '',
    system: false,
    createdBy: TEMPLATE_AUTHOR,
    createdAt: '2022-01-15T10:00:00.000',
    lastModified: '2022-06-20T12:00:00.000',
    modifiedBy: TEMPLATE_AUTHOR
  }));
}
