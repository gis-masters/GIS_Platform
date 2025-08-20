import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const propertyWithAllCheckedAttributes: Schema = {
  name: 'property_with_all_checked_attributes',
  title: 'C полем INT, имеющем все выделенные атрибуты',
  tableName: 'all_types',
  styleName: 'generic',
  geometryType: GeometryType.MULTI_POLYGON,
  properties: [
    {
      name: 'field_int',
      title: 'Поле INT',
      propertyType: PropertyType.INT,
      readOnly: true,
      required: true,
      hidden: true
    }
  ]
};
