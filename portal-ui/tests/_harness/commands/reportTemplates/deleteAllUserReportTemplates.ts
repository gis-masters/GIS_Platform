import { reportTemplateClient } from '../../../../src/app/services/reportTemplate/reportTemplate.client';
import { requestAsAdmin } from '../requestAs';

export async function deleteAllUserReportTemplates(): Promise<void> {
  const templates = await requestAsAdmin(reportTemplateClient.getTemplates);

  for (const { name } of templates) {
    const full = await requestAsAdmin(reportTemplateClient.getTemplate, name);
    if (!full.system) {
      await requestAsAdmin(reportTemplateClient.deleteTemplate, name);
    }
  }
}
