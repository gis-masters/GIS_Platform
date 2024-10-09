import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const forTestInteraction: Schema = {
  name: 'interaction',
  title: 'Оперативное взаимодействие',
  readOnly: false,
  tableName: 'interaction',
  styleName: 'interaction',
  geometryType: GeometryType.MULTI_POLYGON,
  properties: [
    {
      name: 'cad_num_new',
      title: 'Кадастровый номер',
      propertyType: PropertyType.STRING
    },
    {
      name: 'shape',
      title: 'geometry',
      propertyType: PropertyType.GEOMETRY
    },
    {
      name: 'area_dpt',
      title: 'Площадь вычисляемая, м.кв.',
      propertyType: PropertyType.FLOAT
    },
    {
      name: 'shape_area',
      title: 'Площадь',
      propertyType: PropertyType.INT
    },
    {
      name: 'status',
      title: 'Статус объекта',
      propertyType: PropertyType.CHOICE,
      options: [
        {
          value: 'Нет замечаний',
          title: 'Нет замечаний'
        },
        {
          value: 'Новое замечание',
          title: 'Новое замечание'
        },
        {
          value: 'Замечание исправлено',
          title: 'Замечание исправлено'
        }
      ]
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
