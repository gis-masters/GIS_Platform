import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const withInappropriateStyleName: Schema = {
  name: 'withInappropriateStyleName',
  title: 'С несоответствующим слою styleName',
  readOnly: false,
  tableName: 'with_inappropriate_style_name',
  styleName: 'buildings',
  properties: [
    {
      name: 'shape',
      title: 'geometry',
      propertyType: PropertyType.GEOMETRY
    },
    {
      name: 'ruleid',
      title: 'Идентификатор',
      hidden: true,
      required: true,
      propertyType: PropertyType.STRING
    }
  ],
  geometryType: GeometryType.MULTI_POLYGON
};
