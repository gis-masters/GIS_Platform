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
      name: 'field_read_only',
      title: 'Поле readOnly',
      propertyType: PropertyType.INT,
      readOnly: true
    },
    {
      name: 'field_required',
      title: 'Поле required',
      propertyType: PropertyType.INT,
      required: true
    },
    {
      name: 'field_hidden',
      title: 'Поле hidden',
      propertyType: PropertyType.INT,
      hidden: true
    }
  ]
};
