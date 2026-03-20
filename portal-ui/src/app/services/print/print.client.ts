import { boundClass } from 'autobind-decorator';

import { Client } from '../api/Client';
import { http } from '../api/http.service';
import { Mime } from '../util/Mime';
import { type CreateReportRequest, type TemplateInfo } from './print.models';

const headers = { 'Content-Type': Mime.JSON };

@boundClass
class PrintClient extends Client {
  private static _instance: PrintClient;
  static get instance(): PrintClient {
    return this._instance || (this._instance = new this());
  }

  private getReportsUrl(): string {
    return this.getBaseUrl() + '/reports';
  }

  private getTemplatesUrl(): string {
    return this.getBaseUrl() + '/templates';
  }

  async createReport(request: CreateReportRequest): Promise<string> {
    return http.post<string>(this.getReportsUrl(), request, { headers });
  }

  async getTemplates(): Promise<TemplateInfo[]> {
    return http.get<TemplateInfo[]>(this.getTemplatesUrl());
  }
}

export const printClient = PrintClient.instance;
