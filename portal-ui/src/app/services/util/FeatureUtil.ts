import {ValueType} from './FeaturePropertyValidators';
import {FeatureDescription, PropertySchema} from '../crg/data-schema.service';
import {CrgRootGeometry, GeometryItem} from './crg-root-geometry';
import {ImportLayerItem, LayerAttribute} from '../geoserver/import/models';
import {AS_IS, NOT_IMPORT} from '../crg/models';

export class FeatureUtil {

  static getLayerGeometry(importLayer: ImportLayerItem) {
    return importLayer.attributes
                .find((attr: LayerAttribute) => attr.name === 'the_geom')
                .binding;
  }

  // layer = Point, MultiLineString, MultiPolygon
  // feature = Point, LineString, Polygon, Curve
  static isFeatureGeometryCompatible(layerGeometryTypeName: string, featureDescription: FeatureDescription): boolean {
    const splited = layerGeometryTypeName.split('.');
    const layerGeometryName = splited[splited.length - 1];

    const allowedGeometry: string[] = this.fillAllowedGeometry(new CrgRootGeometry(), layerGeometryName);
    const featureGeometry = this.getFeatureGeometry(featureDescription);
    let result = false;
    featureGeometry.forEach(value => {
      if (allowedGeometry.includes(value)) {
        result = true;
      }
    });

    return result;
  }

  static getFeatureGeometry(featureDescription: FeatureDescription): string[] {
    const geometryProperty = featureDescription.properties
                                               .find(property => property.valueType === ValueType.GEOMETRY);

    if (geometryProperty) {
      return geometryProperty.allowedValues;
    } else {
      return [];
    }
  }

  static filterByGeometry(fDescription: FeatureDescription[], layer?: ImportLayerItem): FeatureDescription[] {
    const geometryName = FeatureUtil.getLayerGeometry(layer);

    return fDescription.filter((featureDescription: FeatureDescription) => {
      return FeatureUtil.isFeatureGeometryCompatible(geometryName, featureDescription);
    });
  }

  static preparePropertySchema(targetFeatureType: FeatureDescription): PropertySchema[] {
    const propertySchemas: PropertySchema[] = [
      {name: NOT_IMPORT.name, title: NOT_IMPORT.title},
      {name: AS_IS.name, title: AS_IS.title}
    ];

    targetFeatureType.properties.forEach((property: PropertySchema) => {
      propertySchemas.push(property);
    });

    return propertySchemas;
  }

  /**
   * Метод возвращает список допустимых типов геометрии исходя из переданного названия исходной геометрии.
   * @param geometryDefinition root
   * @param geometryName Название геометрии
   */
  private static fillAllowedGeometry(geometryDefinition: GeometryItem, geometryName: string): string[] {
    const allowedGeometry: string[] = [];
    geometryDefinition.child.forEach((geometryItem: GeometryItem) => {
      if (geometryItem.name === geometryName) {
        allowedGeometry.push(geometryName);
        this.collectAll(geometryItem, allowedGeometry, geometryName);
      } else {
        allowedGeometry.push(...this.fillAllowedGeometry(geometryItem, geometryName));
      }
    });

    return allowedGeometry;
  }

  private static collectAll(rootGeometry: GeometryItem, allowedGeometry: string[], name: string) {
    rootGeometry.child.forEach((geometryItem: GeometryItem) => {
      allowedGeometry.push(geometryItem.name);
      this.collectAll(geometryItem, allowedGeometry, name);
    });
  }
}
