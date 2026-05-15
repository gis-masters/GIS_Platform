import { boundClass } from 'autobind-decorator';
import { type AxiosResponse, isAxiosError } from 'axios';

import { Client } from '../api/Client';
import { http } from '../api/http.service';
import { replaceUrl } from '../api/server-urls.service';
import { Mime } from '../util/Mime';
import { type TemplateCreatePayload, type TemplateInfo, type TemplateShortInfo } from './reportTemplate.models';
import { parseContentDispositionFilename } from './reportTemplate.utils';

export interface TemplateDownloadBlob {
  blob: Blob;
  filenameHint?: string;
}

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
    const { blob } = await this.downloadTemplateBlob(name);

    return blob;
  }

  async downloadTemplateBlob(name: string): Promise<TemplateDownloadBlob> {
    const url = replaceUrl(`${this.getTemplateUrl(name)}/download`);

    const fetchBlob = async () =>
      http.axios.get<Blob>(url, {
        responseType: 'blob'
      });

    let response: AxiosResponse<Blob>;
    try {
      response = await fetchBlob();
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 401) {
        await http.waitForAuth();
        response = await fetchBlob();
      } else {
        throw error;
      }
    }

    const rawDisposition: unknown = response.headers['content-disposition'];
    const filenameHint = parseContentDispositionFilename(
      typeof rawDisposition === 'string' ? rawDisposition : undefined
    );

    return { blob: response.data, filenameHint };
  }

  async deleteTemplate(name: string): Promise<void> {
    await http.delete(this.getTemplateUrl(name));
  }
}

export const reportTemplateClient = ReportTemplateClient.instance;
