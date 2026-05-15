import path from 'node:path';
import fs from 'fs/promises';
import { Blob, File } from 'web-file-polyfill';

import { reportTemplateClient } from '../../../../src/app/services/reportTemplate/reportTemplate.client';
import { type TemplateCreatePayload } from '../../../../src/app/services/reportTemplate/reportTemplate.models';
import { requestAsAdmin } from '../requestAs';

const FIXTURE_NAME = 'reportTemplateMinimal.docx';

export async function createUserReportTemplateForTest(name: string, title: string): Promise<void> {
  const filePath = path.join(__dirname, '..', '..', '..', '_files', FIXTURE_NAME);
  const fileBuffer = await fs.readFile(filePath);
  // @ts-expect-error Buffer as blob part in test env
  const file = new File([new Blob([fileBuffer])], FIXTURE_NAME);

  const dto: TemplateCreatePayload = { name, title, printFormSchemaOverrides: null };
  await requestAsAdmin(reportTemplateClient.createTemplate, dto, file);
}
