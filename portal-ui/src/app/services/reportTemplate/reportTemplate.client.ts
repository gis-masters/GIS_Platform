import { boundClass } from 'autobind-decorator';

import { Client } from '../api/Client';
import { http } from '../api/http.service';
import { Mime } from '../util/Mime';
import { type TemplateCreatePayload, type TemplateInfo, type TemplateShortInfo } from './reportTemplate.models';

@boundClass
class ReportTemplateClient extends Client {
  private static _instance: ReportTemplateClient;
  static get instance(): ReportTemplateClient {
    return this._instance || (this._instance = new this());
  }

  private getTemplatesUrl(): string {
    return this.getBaseUrl() + '/templates';
  }

  private getTemplateUrl(name: string): string {
    return `${this.getTemplatesUrl()}/${encodeURIComponent(name)}`;
  }

  async getTemplates(): Promise<TemplateShortInfo[]> {
    return http.get<TemplateShortInfo[]>(this.getTemplatesUrl());
  }

  async getTemplate(name: string): Promise<TemplateInfo> {
    return http.get<TemplateInfo>(this.getTemplateUrl(name));
  }

  async createTemplate(dto: TemplateCreatePayload, file: File): Promise<TemplateShortInfo> {
    const formData = new FormData();
    formData.append('dto', new Blob([JSON.stringify(dto)], { type: Mime.JSON }));
    formData.append('file', file);

    return http.post<TemplateShortInfo>(this.getTemplatesUrl(), formData);
  }

  async downloadTemplate(name: string): Promise<Blob> {
    return http.get<Blob>(`${this.getTemplateUrl(name)}/download`, { responseType: 'blob' });
  }

  async deleteTemplate(name: string): Promise<void> {
    await http.delete(this.getTemplateUrl(name));
  }
}

export const reportTemplateClient = ReportTemplateClient.instance;
