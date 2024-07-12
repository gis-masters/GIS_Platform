export interface GeometryItem {
  name: string;
  child: GeometryItem[];
}

/**
 * Корень дерева геометрий.
 */
export class CrgRootGeometry implements GeometryItem {
  name = '';
  child: GeometryItem[] = [
    {
      name: 'Point',
      child: []
    },
    {
      name: 'Curve',
      child: [
        {
          name: 'LineString',
          child: []
        }
      ]
    },
    {
      name: 'Surface',
      child: [
        {
          name: 'Polygon',
          child: [
            {
              name: 'LinearRing',
              child: []
            }
          ]
        },
        {
          name: 'PolyhedralSurface',
          child: [
            {
              name: 'Polygon',
              child: []
            }
          ]
        }
      ]
    },
    {
      name: 'GeometryCollection',
      child: [
        {
          name: 'MultiSurface',
          child: [
            {
              name: 'MultiPolygon',
              child: [
                {
                  name: 'Polygon',
                  child: []
                }
              ]
            }
          ]
        },
        {
          name: 'MultiCurve',
          child: [
            {
              name: 'MultiLineString',
              child: [
                {
                  name: 'LineString',
                  child: []
                }
              ]
            }
          ]
        },
        {
          name: 'MultiPoint',
          child: [
            {
              name: 'Point',
              child: []
            }
          ]
        }
      ]
    }
  ];
}
