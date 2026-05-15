import { type WfsFeature } from '../../geoserver/wfs/wfs.models';
import { type CrgLayer } from '../../gis/layers/layers.models';

/** Элемент списка пересечений участка с ОКС для шаблонов печати. */
export type OksIntersectionPrintItem = {
  layer: CrgLayer;
  type: string;
  feature: WfsFeature;
  intersectionArea?: number;
  intersectionAreaPercent?: number;
};
