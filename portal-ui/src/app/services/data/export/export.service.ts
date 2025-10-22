import { wsService } from '../../ws.service';
import { type Process } from '../processes/processes.models';
import { exportClient } from './export.client';
import { type ExportRequest, type ExportResourceModel } from './export.models';

export async function exportVectorTableAsGML(
  docSchema: string,
  resources: ExportResourceModel[],
  epsg: string,
  invertedCoordinates: boolean
): Promise<Process> {
  const payload: ExportRequest = {
    wsUiId: wsService.getId(),
    format: 'GML',
    resources,
    docSchema,
    epsg,
    invertedCoordinates
  };

  return exportClient.export(payload);
}

export async function downloadExportResult(fileName: string): Promise<Blob> {
  return await exportClient.download(fileName);
}
