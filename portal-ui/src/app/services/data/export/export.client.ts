import { http } from '../../http.service';
import { getExportUrl } from '../../server-urls.service';
import { Mime } from '../../util/Mime';
import { Process } from '../processes/processes.models';

import { ExportRequest } from './export.models';

export async function _reqExport(payload: ExportRequest): Promise<Process> {
  return http.post<Process>(await getExportUrl(), JSON.stringify(payload), {
    headers: { 'Content-Type': Mime.JSON }
  });
}
