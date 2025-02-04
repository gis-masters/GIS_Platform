import { wsService } from '../../ws.service';
import { Process } from '../processes/processes.models';
import { exportClient } from './export.client';
import { ExportRequest, ExportResourceModel } from './export.models';

export async function exportVectorTableAsShape(
  resources: ExportResourceModel[],
  epsg = 'EPSG:28406'
): Promise<Process> {
  const payload: ExportRequest = {
    wsUiId: wsService.getId(),
    format: 'ESRI Shapefile',
    resources,
    epsg
  };

  return exportClient.export(payload);
}

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
