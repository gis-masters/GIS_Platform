import { getFileProcessesUrl, getProcessesUrl, getProcessUrl } from '../../api/server-urls.service';
import { http } from '../../api/http.service';
import { Mime } from '../../util/Mime';

import { Process, ProcessableModel, ProcessResponse } from './processes.models';

export async function _reqGetProcess(id: number): Promise<Process> {
  return http.get<Process>(await getProcessUrl(id), {
    cache: { disabled: true }
  });
}

export async function _reqCreateProcess(model: ProcessableModel): Promise<ProcessResponse> {
  return http.post<ProcessResponse>(await getProcessesUrl(), JSON.stringify(model), {
    headers: { 'Content-Type': Mime.JSON }
  });
}

export async function _reqCreateFileProcess(model: FormData): Promise<ProcessResponse> {
  return http.post<ProcessResponse>(await getFileProcessesUrl(), model, {
    headers: { 'Content-Type': Mime.FORM_DATA }
  });
}
