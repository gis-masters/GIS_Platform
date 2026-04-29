import type { TemplateCreateDto, TemplateFullInfo } from '../../../server-types/common-contracts';
import type { JsonNode } from '../../../server-types/jackson-types';

export { type TemplateCreateDto, type TemplateShortInfo } from '../../../server-types/common-contracts';

export type TemplateInfo = TemplateFullInfo;

/** DTO при создании шаблона из формы: `printFormSchemaOverrides` может быть `null`. */
export type TemplateCreatePayload = Omit<TemplateCreateDto, 'printFormSchemaOverrides'> & {
  printFormSchemaOverrides: JsonNode | null;
};
