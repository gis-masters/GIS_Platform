import { wsService } from '../../ws.service';
import { Process } from '../processes/processes.models';

import { _reqExport } from './export.client';
import { ExportRequest, ExportResourceModel } from './export.models';

export async function exportVectorTableAsShape(resources: ExportResourceModel[]): Promise<Process> {
  const payload: ExportRequest = {
    wsUiId: wsService.getId(),
    format: 'ESRI Shapefile',
    resources,
    epsg: 'EPSG:28406'
  };

  return _reqExport(payload);
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

  return _reqExport(payload);
}
