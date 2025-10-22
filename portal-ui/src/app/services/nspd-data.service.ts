import axios from 'axios';

import { type WfsFeature } from './geoserver/wfs/wfs.models';

const nspdApi = 'https://nspd.gov.ru/api/geoportal/v2/search/geoportal?thematicSearchId=1&query=';

export async function getNspdData(kadNum: string): Promise<WfsFeature[]> {
  const response = await axios.get<{ data: { features: WfsFeature[] } }>(nspdApi + kadNum);

  return response.data.data.features || [];
}
