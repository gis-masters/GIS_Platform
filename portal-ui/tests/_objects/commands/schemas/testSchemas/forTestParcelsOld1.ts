import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const forTestParcelsOld1: Schema = {
  name: 'parcelsOld1',
  title: 'Исходные земельные участки',
  readOnly: false,
  tableName: 'parcels_old_1',
  styleName: 'parcels_old_1',
  geometryType: GeometryType.MULTI_POLYGON,
  properties: [
    {
      name: 'linetype',
      title: 'Наименование',
      propertyType: PropertyType.STRING
    },
    {
      name: 'shape',
      title: 'geometry',
      propertyType: PropertyType.GEOMETRY
    },
    {
      name: 'ruleid',
      title: 'Идентификатор стиля',
      hidden: true,
      required: true,
      propertyType: PropertyType.STRING
    }
  ]
};
