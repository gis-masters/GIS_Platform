import { Coordinate } from 'ol/coordinate';
import proj4 from 'proj4';

export type TransformFunction = (coord: Coordinate) => Coordinate;

export interface CrgProjection {
  id: string;
  title: string;
  to: (val: Coordinate) => Coordinate;
  from: (val: Coordinate) => Coordinate;
}

proj4.defs(
  'EPSG:28406',
  '+proj=tmerc ' +
  '+lat_0=0 ' +
  '+lon_0=33 ' +
  '+k=1 ' +
  '+x_0=6500000 ' +
  '+y_0=0 ' +
  '+ellps=krass ' +
  '+towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 ' +
  '+units=m ' +
  '+no_defs'
);

proj4.defs(
  'EPSG:7828',
  '+proj=tmerc ' +
  '+lat_0=0 ' +
  '+lon_0=21 ' +
  '+k=1 ' +
  '+x_0=4500000 ' +
  '+y_0=0 ' +
  '+ellps=krass ' +
  '+towgs84=23.92,-141.27,-80.9,0,0.35,0.82,-0.12 ' +
  '+units=m ' +
  '+no_defs'
);

proj4.defs(
  'EPSG:7829',
  '+proj=tmerc ' +
  '+lat_0=0 ' +
  '+lon_0=27 ' +
  '+k=1 ' +
  '+x_0=5500000 ' +
  '+y_0=0 ' +
  '+ellps=krass ' +
  '+towgs84=23.92,-141.27,-80.9,0,0.35,0.82,-0.12 ' +
  '+units=m ' +
  '+no_defs'
);

//base projection - WGS 84 / Pseudo-Mercator EPSG:3857

export const projections: CrgProjection[] = [
  {
    id: 'EPSG:28406',
    title: 'Pulkovo 1942 / Gauss-Kruger zone 6',
    to: (coordinate) => proj4('EPSG:3857', 'EPSG:28406', coordinate).map(dis => Number(dis.toFixed(4))),
    from: (coordinate) => proj4('EPSG:28406', 'EPSG:3857', coordinate).map(dis => Number(dis.toFixed(4)))
  },
  {
    id: 'EPSG:7828',
    title: 'Pulkovo 1942 / CS63 zone X5',
    to: (coordinate) => proj4('EPSG:3857', 'EPSG:7828', coordinate).map(dis => Number(dis.toFixed(4))),
    from: (coordinate) => proj4('EPSG:7828', 'EPSG:3857', coordinate).map(dis => Number(dis.toFixed(4)))
  },
  {
    id: 'EPSG:7829',
    title: 'Pulkovo 1942 / CS63 zone X4',
    to: (coordinate) => proj4('EPSG:3857', 'EPSG:7829', coordinate).map(dis => Number(dis.toFixed(4))),
    from: (coordinate) => proj4('EPSG:7829', 'EPSG:3857', coordinate).map(dis => Number(dis.toFixed(4)))
  },
  {
    id: 'EPSG:3857',
    title: 'WGS 84 / Pseudo-Mercator',
    to: coordinate => coordinate,
    from: coordinate => coordinate
  },
];

export const defaultProjection = projections[0];
