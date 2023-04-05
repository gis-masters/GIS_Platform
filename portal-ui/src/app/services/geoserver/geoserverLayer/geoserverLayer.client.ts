import { http } from '../../api/http.service';
import { getGeoServerUrl, replaceUrl } from '../../api/server-urls.service';

import { GeoserverCoverage, GeoserverLayerInfo } from './geoserverLayer.models';

export async function _reqGetGeoserverLayerInfo(
  workspace: string,
  tableName: string
): Promise<{ layer: GeoserverLayerInfo }> {
  return http.get<{ layer: GeoserverLayerInfo }>(
    `${await getGeoServerUrl()}/rest/workspaces/${workspace}/layers/${tableName}`
  );
}

export async function _reqGetGeoserverLayerCoverage(
  geoserverLayerInfo: GeoserverLayerInfo
): Promise<{ coverage: GeoserverCoverage }> {
  const url = await replaceUrl(geoserverLayerInfo.resource.href, true);

  return http.get<{ coverage: GeoserverCoverage }>(url);
}
