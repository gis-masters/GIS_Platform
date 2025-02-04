import { boundClass } from 'autobind-decorator';

import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { preparePageOptions } from '../../api/http.utils';
import { PageOptions } from '../../models';
import { Mime } from '../../util/Mime';
import { SearchRequest } from '../search/search.model';
import { Process, ProcessableModel, ProcessResponse } from './processes.models';

@boundClass
class ProcessesClient extends Client {
  private static _instance: ProcessesClient;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private getProcessesUrl(): string {
    return `${this.getDataUrl()}/processes`;
  }

  private getProcessUrl(processId: number): string {
    return `${this.getProcessesUrl()}/${processId}`;
  }

  private getFileProcessesUrl(): string {
    return `${this.getProcessesUrl()}/file`;
  }

  private getSearchProcessesUrl(): string {
    return `${this.getDataUrl()}/fts`;
  }

  async getProcess(id: number): Promise<Process> {
    return http.get<Process>(this.getProcessUrl(id), {
      cache: { disabled: true }
    });
  }

  async createProcess(model: ProcessableModel): Promise<ProcessResponse> {
    return http.post<ProcessResponse>(this.getProcessesUrl(), JSON.stringify(model), {
      headers: { 'Content-Type': Mime.JSON }
    });
  }

  async createFileProcess(model: FormData): Promise<ProcessResponse> {
    return http.post<ProcessResponse>(this.getFileProcessesUrl(), model, {
      headers: { 'Content-Type': Mime.FORM_DATA }
    });
  }

  async createSearchProcess(searchRequest: SearchRequest, pageOptions: PageOptions): Promise<ProcessResponse> {
    const params = preparePageOptions(pageOptions, true);

    return await http.post<ProcessResponse>(this.getSearchProcessesUrl(), searchRequest, {
      cache: { clear: false, disabled: false },
      params
    });
  }
}

export const processesClient = ProcessesClient.instance;
