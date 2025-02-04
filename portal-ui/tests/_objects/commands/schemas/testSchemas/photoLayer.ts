import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';
import { systemProperties } from './_systemProperties';

export const photoLayer: Schema = {
  name: 'photoLayer',
  title: 'Фотослой',
  description: 'Для тестирования фотослоя',
  tableName: 'photolayer',
  styleName: 'generic',
  geometryType: GeometryType.MULTI_POLYGON,
  properties: [
    {
      name: 'title',
      title: 'Название',
      propertyType: PropertyType.STRING
    },
    {
      name: 'photo',
      title: 'Фотофиксация',
      multiple: true,
      propertyType: PropertyType.FILE
    },
    {
      name: 'shape',
      title: 'Поле GEOMETRY',
      propertyType: PropertyType.GEOMETRY
    },
    ...systemProperties
  ]
};
