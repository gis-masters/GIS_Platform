import { boundClass } from 'autobind-decorator';

import { Client } from '../api/Client';
import { http } from '../api/http.service';
import { Mime } from '../util/Mime';
import { type CreateReportRequest } from './report.models';

const headers = { 'Content-Type': Mime.JSON };

@boundClass
class ReportClient extends Client {
  private static _instance: ReportClient;
  static get instance(): ReportClient {
    return this._instance || (this._instance = new this());
  }

  private getReportsUrl(): string {
    return this.getBaseUrl() + '/reports';
  }

  async createReport(request: CreateReportRequest): Promise<string> {
    return http.post<string>(this.getReportsUrl(), request, { headers });
  }
}

export const reportClient = ReportClient.instance;
