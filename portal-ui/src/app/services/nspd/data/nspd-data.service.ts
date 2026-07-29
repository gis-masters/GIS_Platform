import axios from 'axios';

import { type WfsFeature } from '../../geoserver/wfs/wfs.models';

const nspdApi = 'https://nspd.gov.ru/api/geoportal/v2/search/geoportal?thematicSearchId=1&query=';
const nspdAddressSearchApi = 'https://nspd.gov.ru/api/geoportal/v3/geoportal';

export const NSPD_LAND_PARCELS_GEO_PORTAL_ID = 36_048;
export const NSPD_BUILDINGS_GEO_PORTAL_ID = 36_049;

const NSPD_ADDRESS_SEARCH_PAGE = 0;
const NSPD_ADDRESS_SEARCH_COUNT = 5;
const NSPD_ADDRESS_SEARCH_WITH_TOTAL_COUNT = true;
const NSPD_ADDRESS_SEARCH_KEY = 'options.readable_address';

const nspdAddressSearchGeoPortalIds = [NSPD_LAND_PARCELS_GEO_PORTAL_ID, NSPD_BUILDINGS_GEO_PORTAL_ID] as const;

type NspdAddressSearchGeoPortalId = (typeof nspdAddressSearchGeoPortalIds)[number];

interface NspdAddressSearchResponse {
  data: {
    features?: NspdAddressSearchFeature[];
  };
  meta?: NspdAddressSearchMeta[];
}

interface NspdAddressSearchMeta {
  totalCount: number;
  categoryId: number;
}

type NspdAddressSearchFeature = Omit<WfsFeature, 'id' | 'geometry_name'> & {
  id: string | number;
  geometry_name?: string;
};

interface NspdAddressSearchTextQueryAttrib {
  keyName: typeof NSPD_ADDRESS_SEARCH_KEY;
  value: string;
}

export interface NspdAddressSearchPayload {
  textQueryAttrib: NspdAddressSearchTextQueryAttrib[];
}

export interface NspdAddressSearchResult {
  features: WfsFeature[];
  totalCount: number;
  shownCount: number;
  failedSearchCount: number;
}

function getNspdAddressSearchPayload(address: string): NspdAddressSearchPayload {
  return {
    textQueryAttrib: [
      {
        keyName: NSPD_ADDRESS_SEARCH_KEY,
        value: address
      }
    ]
  };
}

function getNspdAddressSearchUrl(geoPortalId: NspdAddressSearchGeoPortalId): string {
  const params = new URLSearchParams({
    page: String(NSPD_ADDRESS_SEARCH_PAGE),
    count: String(NSPD_ADDRESS_SEARCH_COUNT),
    withTotalCount: String(NSPD_ADDRESS_SEARCH_WITH_TOTAL_COUNT)
  });

  return `${nspdAddressSearchApi}/${geoPortalId}/attrib-search?${params}`;
}

async function getNspdAddressSearchResult(
  geoPortalId: NspdAddressSearchGeoPortalId,
  payload: NspdAddressSearchPayload
): Promise<NspdAddressSearchResult> {
  const response = await axios.post<NspdAddressSearchResponse>(getNspdAddressSearchUrl(geoPortalId), payload);
  const features = (response.data.data.features || []).map(normalizeNspdAddressSearchFeature);
  const totalCount = Math.max(getNspdAddressSearchTotalCount(response.data), features.length);

  return {
    features,
    totalCount,
    shownCount: features.length,
    failedSearchCount: 0
  };
}

function normalizeNspdAddressSearchFeature(feature: NspdAddressSearchFeature): WfsFeature {
  return {
    ...feature,
    id: String(feature.id),
    geometry_name: feature.geometry_name || 'geometry'
  };
}

function getNspdAddressSearchTotalCount(response: NspdAddressSearchResponse): number {
  return (response.meta || []).reduce((sum, { totalCount }) => sum + totalCount, 0);
}

export async function getNspdData(kadNum: string): Promise<WfsFeature[]> {
  const response = await axios.get<{ data: { features: WfsFeature[] } }>(nspdApi + kadNum);

  return response.data.data.features || [];
}

export async function getNspdDataByAddress(address: string): Promise<NspdAddressSearchResult> {
  const payload = getNspdAddressSearchPayload(address);
  const results = await Promise.allSettled(
    nspdAddressSearchGeoPortalIds.map(geoPortalId => getNspdAddressSearchResult(geoPortalId, payload))
  );
  const fulfilledResults: NspdAddressSearchResult[] = [];
  const failedSearchErrors: unknown[] = [];

  for (const result of results) {
    if (result.status === 'fulfilled') {
      fulfilledResults.push(result.value);
    } else {
      failedSearchErrors.push(result.reason);
    }
  }

  if (!fulfilledResults.length && failedSearchErrors.length) {
    throw failedSearchErrors[0];
  }

  const features = fulfilledResults.flatMap(({ features }) => features);
  const totalCount = fulfilledResults.reduce((sum, { totalCount }) => sum + totalCount, 0);

  return {
    features,
    totalCount,
    shownCount: features.length,
    failedSearchCount: failedSearchErrors.length
  };
}
