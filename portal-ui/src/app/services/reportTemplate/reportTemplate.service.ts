import { communicationService } from '../communication.service';
import { reportTemplateClient } from './reportTemplate.client';
import { type TemplateCreatePayload, type TemplateInfo, type TemplateUpdatePatch } from './reportTemplate.models';
import { fallbackReportTemplateFilename, sanitizeDownloadBasename } from './reportTemplate.utils';

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

export async function createTemplate(dto: TemplateCreatePayload, file: File): Promise<TemplateInfo> {
  const created = await reportTemplateClient.createTemplate(dto, file);
  const full = await reportTemplateClient.getTemplate(created.name);
  communicationService.reportTemplateUpdated.emit({ type: 'create', data: full });

  return full;
}

export async function downloadTemplate(name: string): Promise<Blob> {
  return await reportTemplateClient.downloadTemplate(name);
}

export async function deleteTemplate(snapshot: TemplateInfo): Promise<void> {
  await reportTemplateClient.deleteTemplate(snapshot.name);
  communicationService.reportTemplateUpdated.emit({ type: 'delete', data: snapshot });
}

export async function updateTemplate(originalName: string, patch: TemplateUpdatePatch): Promise<TemplateInfo> {
  const current = await reportTemplateClient.getTemplate(originalName);
  const dto: TemplateCreatePayload = {
    name: patch.name ?? current.name,
    title: patch.title ?? current.title,
    printFormSchemaOverrides:
      patch.printFormSchemaOverrides === undefined ? current.printFormSchemaOverrides : patch.printFormSchemaOverrides
  };

  let file: File;
  if (patch.file) {
    file = patch.file;
  } else {
    const { blob, filenameHint } = await reportTemplateClient.downloadTemplateBlob(originalName);
    const safeHint = filenameHint ? sanitizeDownloadBasename(filenameHint) : undefined;
    const filename = safeHint ?? fallbackReportTemplateFilename(blob, current.name);
    file = new File([blob], filename, {
      type: blob.type || 'application/octet-stream'
    });
  }

  await reportTemplateClient.deleteTemplate(originalName);
  const created = await reportTemplateClient.createTemplate(dto, file);

  const full = await reportTemplateClient.getTemplate(created.name);
  communicationService.reportTemplateUpdated.emit({ type: 'update', data: full });

  return full;
}
