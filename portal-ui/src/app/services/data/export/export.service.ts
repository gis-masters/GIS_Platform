import { wsService } from '../../ws.service';
import { type Process } from '../processes/processes.models';
import { exportClient } from './export.client';
import { type ExportGpkgRequest, type ExportRequest, type ExportResourceModel } from './export.models';

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

export function getExportDownloadUrl(fileName: string): string {
  return exportClient.getDownloadUrl(fileName);
}

export async function exportLayersAsGeoPackage(layerIds: number[]): Promise<Process> {
  const payload: ExportGpkgRequest = {
    wsUiId: wsService.getId(),
    format: 'GPKG',
    payload: {
      type: 'LAYER',
      payload: layerIds
    }
  };

  return exportClient.export(payload);
}
