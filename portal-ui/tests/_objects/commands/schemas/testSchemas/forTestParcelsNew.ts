import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const forTestParcelsNew: Schema = {
  name: 'parcelsNew',
  title: 'Образованные земельные участки',
  readOnly: false,
  tableName: 'parcels_new',
  styleName: 'parcels_new',
  geometryType: GeometryType.MULTI_POLYGON,
  properties: [
    {
      name: 'cad_num',
      title: 'Кадастровый номер',
      propertyType: PropertyType.STRING
    },
    {
      name: 'num_zu',
      title: 'Номер ЗУ',
      propertyType: PropertyType.STRING
    },
    {
      name: 'usage',
      title: 'Разрешенное использование по документу',
      asTitle: true,
      propertyType: PropertyType.STRING
    },
    {
      name: 'readableaddress',
      title: 'Адрес в соответствии с ФИАС',
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
          value: 'Выполнение комплекса кадастровых работ',
          title: 'Выполнение комплекса кадастровых работ'
        },
        {
          value: 'Выполнение оценочных работ',
          title: 'Выполнение оценочных работ'
        },
        {
          value: 'Кадастровые работы в отношении лесных участков',
          title: 'Кадастровые работы в отношении лесных участков'
        },
        {
          value: 'Направленно на ознакомление правообладателю',
          title: 'Направленно на ознакомление правообладателю'
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
