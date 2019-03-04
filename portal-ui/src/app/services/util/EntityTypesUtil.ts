import {LayerAttribute, LayerItem} from '../geoserver/import/import.service';
import {XsdFeature, SimpleProperty} from '../gis/fgistp-rules.service';

export class EntityTypesUtil {

  static getEntityGeometry(entityType: XsdFeature): string[] {
    const simpleProperty = entityType.properties.find((property: SimpleProperty) => property.valueType === 'GEOMETRY');

    if (simpleProperty) {
      return simpleProperty.allowedValues;
    } else {
      return [];
    }
  }

  static getLayerGeometry(layer: LayerItem) {
    return layer.attributes
                .find((attr: LayerAttribute) => attr.name === 'the_geom')
                .binding;
  }

  // layer = Point, MultiLineString, MultiPolygon
  // entity = Point, LineString, Polygon, Curve
  static isLayerGeometryCompatible(layerGeometryTypeName: string, entityType: XsdFeature) {
    const splited = layerGeometryTypeName.split('.');
    const layerGeometryName = splited[splited.length - 1];

    // console.log(' --- ', layerGeometryName);

    const entityGeometry = this.getEntityGeometry(entityType);

    const allowedGeometry: string[] = [];
    EntityTypesUtil.moveByTypes(new Geometry(), allowedGeometry, layerGeometryName);

    // console.log(' ----- ', allowedGeometry);

    let result = false;
    entityGeometry.forEach(value => {
      if (allowedGeometry.includes(value)) {
        result = true;
      }
    });

    return result;
  }

  private static moveByTypes(data: Item, allowedGeometry: string[], name: string) {
    data.items.forEach((item: Item) => {
      if (item.name === name) {
        allowedGeometry.push(name);
        this.collectAll(item, allowedGeometry, name);
      } else {
        this.moveByTypes(item, allowedGeometry, name);
      }
    });
  }

  private static collectAll(data: Item, allowedGeometry: string[], name: string) {
    data.items.forEach((item: Item) => {
      allowedGeometry.push(item.name);
      this.collectAll(item, allowedGeometry, name);
    });
  }
}

export interface Item {
  name: string;
  items: Item[];
}

export class Geometry implements Item {
  name: string;
  items: Item[] = [
    {
      name: 'Point',
      items: []
    },
    {
      name: 'Curve',
      items: [
        {
          name: 'LineString',
          items: [
            {
              name: 'Point',
              items: []
            },
            {
              name: 'Line',
              items: []
            },
            {
              name: 'LinearRing',
              items: []
            },
          ]
        },
      ]
    },
    {
      name: 'Surface',
      items: [
        {
          name: 'Polygon',
          items: [
            {
              name: 'LinearRing',
              items: []
            }
          ]
        },
        {
          name: 'PolyhedralSurface',
          items: [
            {
              name: 'Polygon',
              items: []
            }
          ]
        },
      ]
    },
    {
      name: 'GeometryCollection',
      items: [
        {
          name: 'MultiSurface',
          items: [
            {
              name: 'MultiPolygon',
              items: [
                {
                  name: 'Polygon',
                  items: []
                }
              ]
            },
          ]
        },
        {
          name: 'MultiCurve',
          items: [
            {
              name: 'MultiLineString',
              items: [
                {
                  name: 'LineString',
                  items: []
                }
              ]
            },
          ]
        },
        {
          name: 'MultiPoint',
          items: [
            {
              name: 'Point',
              items: []
            }
          ]
        },
      ]
    },
  ];
}
