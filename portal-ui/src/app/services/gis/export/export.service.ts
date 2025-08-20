import { Projection } from '../../data/projections/projections.models';
import { getProjectionCode } from '../../data/projections/projections.util';
import { saveAsBlob } from '../../util/FileSaver';
import { Mime } from '../../util/Mime';
import { exportClient } from './export.client';

export async function exportShape(typeName: string, projection: Projection, layerTitle: string): Promise<void> {
  const file = await exportClient.getExportShape(typeName, getProjectionCode(projection), layerTitle);
  const blob = new Blob([file], { type: Mime.ZIP });

  saveAsBlob(`${layerTitle}.zip`, blob);
}
