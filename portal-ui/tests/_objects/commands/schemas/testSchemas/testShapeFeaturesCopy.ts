import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const testShapeFeaturesCopy: Schema = {
  name: 'testShapeFeaturesCopy',
  title: 'для тестирования копирования объектов из шейпа',
  description: 'Для тестирования копирования объектов из шейпа в атрибутивной таблице',
  readOnly: false,
  tableName: 'test_shape_features_copy',
  styleName: 'generic',
  geometryType: GeometryType.MULTI_POLYGON,
  properties: [
    {
      name: 'usage',
      title: 'usage',
      propertyType: PropertyType.STRING
    },
    {
      name: 'category',
      title: 'category',
      propertyType: PropertyType.STRING
    },
    {
      name: 'is_enabled',
      title: 'Поле BOOL',
      propertyType: PropertyType.BOOL
    },
    {
      name: 'shape',
      title: 'Поле для геометрии',
      propertyType: PropertyType.GEOMETRY
    }
  ]
};
