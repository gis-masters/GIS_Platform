import { reportTemplateClient } from './reportTemplate.client';
import { type TemplateCreatePayload, type TemplateInfo, type TemplateShortInfo } from './reportTemplate.models';

export async function getTemplates(): Promise<TemplateInfo[]> {
  const list = await reportTemplateClient.getTemplates();
  const full: TemplateInfo[] = [];

  for (const { name } of list) {
    full.push(await reportTemplateClient.getTemplate(name));
  }

  return full;
}

export async function getTemplate(name: string): Promise<TemplateInfo> {
  return await reportTemplateClient.getTemplate(name);
}

export async function createTemplate(dto: TemplateCreatePayload, file: File): Promise<TemplateShortInfo> {
  return await reportTemplateClient.createTemplate(dto, file);
}

export async function downloadTemplate(name: string): Promise<Blob> {
  return await reportTemplateClient.downloadTemplate(name);
}

export async function deleteTemplate(name: string): Promise<void> {
  await reportTemplateClient.deleteTemplate(name);
}
