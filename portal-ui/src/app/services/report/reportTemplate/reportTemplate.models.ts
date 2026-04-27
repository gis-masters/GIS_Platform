import type { TemplateCreateDto, TemplateFullInfo } from '../../../../server-types/common-contracts';

export { type TemplateCreateDto, type TemplateShortInfo } from '../../../../server-types/common-contracts';

export type TemplateInfo = TemplateFullInfo;
export type TemplateCreatePayload = Omit<TemplateCreateDto, 'printFormSchemaOverrides'> & {
  printFormSchemaOverrides: TemplateCreateDto['printFormSchemaOverrides'] | null;
};
