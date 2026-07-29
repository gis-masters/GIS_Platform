import { type Coordinate } from 'ol/coordinate';

import { type Schema } from '../../data/schema/schema.models';
import { GeometryType } from '../../geoserver/wfs/wfs.models';

export interface NspdKnownLayer {
  title: string;
  url: string;
  resourceId: string;
  schemaName?: string;
}

export interface NspdGetFeatureInfoResponse {
  type: 'FeatureCollection';
  features?: NspdGetFeatureInfoFeature[];
}

export interface NspdGetFeatureInfoFeature {
  id?: string | number;
  type: 'Feature';
  geometry?: NspdGetFeatureInfoGeometry;
  properties?: NspdGetFeatureInfoProperties;
}

export interface NspdGetFeatureInfoGeometry {
  type: string;
  coordinates: Coordinate | Coordinate[] | Coordinate[][] | Coordinate[][][];
}

export interface NspdGetFeatureInfoProperties {
  options?: Record<string, unknown>;
  [key: string]: unknown;
}

export const nspdFallbackSchema: Schema = {
  name: 'nspd_fallback',
  title: 'НСПД',
  properties: [],
  geometryType: GeometryType.MULTI_POLYGON,
  readOnly: true
};

export const nspdKnownLayers: NspdKnownLayer[] = [
  {
    title: 'Границы населенных пунктов',
    resourceId: 'nspd_settlement_boundaries',
    schemaName: 'nspd_settlement_border',
    url: 'https://nspd.gov.ru/api/aeggis/v4/875831/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=875831&RANDOM=0.2847195639201847&WIDTH=512&HEIGHT=512&CRS=EPSG%3A3857'
  },
  {
    title: 'Земельные участки',
    resourceId: 'nspd_zu',
    schemaName: 'nspd_zu',
    url: 'https://nspd.gov.ru/api/aeggis/v4/36048/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=36048&RANDOM=0.44653047870736495&WIDTH=512&HEIGHT=512&CRS=EPSG%3A3857'
  },
  {
    title: 'Здания',
    resourceId: 'nspd_buildings',
    schemaName: 'nspd_oks',
    url: 'https://nspd.gov.ru/api/aeggis/v4/36049/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=36049&RANDOM=0.7070291970772211&WIDTH=512&HEIGHT=512&CRS=EPSG%3A3857'
  },
  {
    title: 'Сооружения',
    resourceId: 'nspd_structures',
    schemaName: 'nspd_structures',
    url: 'https://nspd.gov.ru/api/aeggis/v4/36328/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=36328&RANDOM=0.046698735051472706&WIDTH=512&HEIGHT=512&CRS=EPSG%3A3857'
  },
  {
    title: 'Объекты незавершенного строительства',
    resourceId: 'nspd_unfinished_construction',
    schemaName: 'nspd_oks',
    url: 'https://nspd.gov.ru/api/aeggis/v4/36329/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=36329&RANDOM=0.834313794645712&WIDTH=512&HEIGHT=512&CRS=EPSG%3A3857'
  },
  {
    title: 'ЗОУИТ объектов культурного наследия',
    resourceId: 'nspd_zouit_cultural_heritage',
    schemaName: 'nspd_zouit',
    url: 'https://nspd.gov.ru/api/aeggis/v4/37577/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=37577&RANDOM=0.32158844231405004&WIDTH=512&HEIGHT=512&CRS=EPSG%3A3857'
  },
  {
    title: 'ЗОУИТ объектов энергетики, связи',
    resourceId: 'nspd_zouit_energy_comm',
    schemaName: 'nspd_zouit',
    url: 'https://nspd.gov.ru/api/aeggis/v4/37578/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=37578&RANDOM=0.3776835050537042&WIDTH=512&HEIGHT=512&CRS=EPSG%3A3857'
  },
  {
    title: 'ЗОУИТ природных территорий',
    resourceId: 'nspd_zouit_nature',
    schemaName: 'nspd_zouit',
    url: 'https://nspd.gov.ru/api/aeggis/v4/37580/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=37580&RANDOM=0.5264451168030497&WIDTH=512&HEIGHT=512&CRS=EPSG%3A3857'
  },
  {
    title: 'ЗОУИТ охраняемых объектов и безопасности',
    resourceId: 'nspd_zouit_security',
    schemaName: 'nspd_zouit',
    url: 'https://nspd.gov.ru/api/aeggis/v4/37579/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=37579&RANDOM=0.01729411854666063&WIDTH=512&HEIGHT=512&CRS=EPSG%3A3857'
  },
  {
    title: 'Иные ЗОУИТ',
    resourceId: 'nspd_zouit_other',
    schemaName: 'nspd_zouit',
    url: 'https://nspd.gov.ru/api/aeggis/v4/37581/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=37581&RANDOM=0.660329607839282&WIDTH=512&HEIGHT=512&CRS=EPSG%3A3857'
  },
  {
    title: 'Территориальные зоны',
    resourceId: 'nspd_territorial_zones',
    schemaName: 'nspd_ter_zone',
    url: 'https://nspd.gov.ru/api/aeggis/v4/36315/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=36315&RANDOM=0.7587829578934162&WIDTH=512&HEIGHT=512&CRS=EPSG%3A3857'
  },
  {
    title: 'Красные линии',
    resourceId: 'nspd_red_lines',
    schemaName: 'nspd_border',
    url: 'https://nspd.gov.ru/api/aeggis/v4/37293/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=37293&RANDOM=0.7310366414914704&WIDTH=512&HEIGHT=512&CRS=EPSG%3A3857'
  },
  {
    title: 'Особо охраняемые природные территории',
    resourceId: 'nspd_protected_nature',
    url: 'https://nspd.gov.ru/api/aeggis/v4/36317/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=36317&RANDOM=0.5912670370674582&WIDTH=512&HEIGHT=512&CRS=EPSG%3A3857'
  },
  {
    title: 'Охотничьи угодья',
    resourceId: 'nspd_hunting_grounds',
    url: 'https://nspd.gov.ru/api/aeggis/v4/36311/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=36311&RANDOM=0.019540767635586542&WIDTH=512&HEIGHT=512&CRS=EPSG%3A3857'
  },
  {
    title: 'Лесничества',
    resourceId: 'nspd_forestry',
    url: 'https://nspd.gov.ru/api/aeggis/v4/36314/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=36314&RANDOM=0.12410972233783313&WIDTH=512&HEIGHT=512&CRS=EPSG%3A3857'
  },
  {
    title: 'Граница лесопарка',
    resourceId: 'nspd_forest_park_boundary',
    schemaName: 'nspd_border',
    url: 'https://nspd.gov.ru/api/aeggis/v4/843763/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=843763&RANDOM=0.37206686456087157&WIDTH=512&HEIGHT=512&CRS=EPSG%3A3857'
  },
  {
    title: 'Территории объектов культурного наследия',
    resourceId: 'nspd_cultural_heritage_territories',
    url: 'https://nspd.gov.ru/api/aeggis/v4/36316/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=36316&RANDOM=0.9834870149351826&WIDTH=512&HEIGHT=512&CRS=EPSG%3A3857'
  }
];

export function getNspdKnownLayer(resourceId?: string): NspdKnownLayer | undefined {
  return nspdKnownLayers.find(layer => layer.resourceId === resourceId);
}
