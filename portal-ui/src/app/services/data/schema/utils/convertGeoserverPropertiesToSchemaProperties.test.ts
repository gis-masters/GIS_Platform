import { type Attribute } from '../../../geoserver/featureType/featureType.model';
import { type PropertySchema, PropertyType } from '../schema.models';
import { convertGeoserverPropertiesToSchemaProperties } from './convertGeoserverPropertiesToSchemaProperties';

const baseGeoserverAttribute = {
  name: 'baseName',
  binding: 'base.type',
  length: -1,
  minOccurs: -1,
  maxOccurs: -1,
  nillable: false
};

describe('утилита конвертации свойств геосервера в свойства нашей схемы', () => {
  test('Атрибут геосервера с любой геометрией конвертируется как PropertyType.GEOMETRY с title = Геометрия', () => {
    const geoserverAttributes: Attribute[] = [
      {
        ...baseGeoserverAttribute,
        name: 'attributeName',
        binding: 'org.locationtech.jts.geom.Geometry'
      }
    ];

    const geometryProperty: PropertySchema = {
      name: 'attributeName',
      title: 'Геометрия',
      propertyType: PropertyType.GEOMETRY
    };

    expect(convertGeoserverPropertiesToSchemaProperties(geoserverAttributes)).toStrictEqual([geometryProperty]);
  });

  test('Атрибуты BigInteger, Long, Integer конвертируются в PropertyType.INT', () => {
    const geoserverAttributes: Attribute[] = [
      {
        ...baseGeoserverAttribute,
        name: 'attributeBigInteger',
        binding: 'java.math.BigInteger'
      },
      {
        ...baseGeoserverAttribute,
        name: 'attributeLong',
        binding: 'java.lang.Long'
      },
      {
        ...baseGeoserverAttribute,
        name: 'attributeInteger',
        binding: 'java.lang.Integer'
      }
    ];

    const expected: PropertySchema[] = [
      {
        name: 'attributeBigInteger',
        title: 'attributeBigInteger',
        propertyType: PropertyType.INT
      },
      {
        name: 'attributeLong',
        title: 'attributeLong',
        propertyType: PropertyType.INT
      },
      {
        name: 'attributeInteger',
        title: 'attributeInteger',
        propertyType: PropertyType.INT
      }
    ];

    expect(convertGeoserverPropertiesToSchemaProperties(geoserverAttributes)).toStrictEqual(expected);
  });
});
