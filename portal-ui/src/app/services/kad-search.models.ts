interface Attrs {
  address: string;
  category_type: string; // eslint-disable-line camelcase
  cn: string;
  id: string;
}

interface Point {
  y: number;
  x: number;
}

interface Extent {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
}

export interface KadItem {
  attrs: Attrs;
  center?: Point;
  extent?: Extent;
  sort: number;
  type: number;
}

export interface KadObject {
  value: string;
  title: string;
}
