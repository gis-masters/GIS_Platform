import { getWfsUrl } from '../../api/server-urls.service';
import { http } from '../../api/http.service';
import { Mime } from '../../util/Mime';

import { WfsFeatureCollection } from './wfs.models';

export async function _reqGetWfsFeatureCollection(params: Record<string, string>): Promise<WfsFeatureCollection> {
  return http.get<WfsFeatureCollection>(await getWfsUrl(), { params, headers: { 'Content-Type': Mime.JSON } });
}

export async function _reqGetFeatureCollectionByXmlFilter(xml: string): Promise<WfsFeatureCollection> {
  return http.post<WfsFeatureCollection>(await getWfsUrl(), xml, {
    headers: { 'Content-Type': Mime.XML },
    params: {
      exceptions: Mime.JSON,
      outputFormat: Mime.JSON
    },
    cache: { clear: false, disabled: false }
  });
}
