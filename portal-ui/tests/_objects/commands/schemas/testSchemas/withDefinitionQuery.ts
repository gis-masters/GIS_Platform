import { PropertyType, Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const withDefinitionQuery: Schema = {
  name: 'withDefinitionQuery',
  title: 'С определяющим запросом',
  description: 'Схема с определяющим запросом в одном из представлений',
  readOnly: false,
  tableName: 'definition_query',
  styleName: 'generic',
  properties: [
    {
      name: 'name',
      title: 'Наименование',
      propertyType: PropertyType.STRING
    },
    {
      name: 'shape_area',
      title: 'Площадь',
      readOnly: true,
      propertyType: PropertyType.FLOAT,
      precision: 2,
      calculatedValueWellKnownFormula: 'st_area'
    },
    {
      name: 'shape',
      title: 'geometry',
      propertyType: PropertyType.GEOMETRY
    }
  ],
  views: [
    {
      id: 'withDefinitionQuery',
      title: 'С определяющим запросом',
      definitionQuery: 'shape_area > 200000000',
      type: 'VIEW',
      properties: [{ name: 'name' }, { name: 'shape_area' }]
    },
    {
      id: 'withoutDefinitionQuery',
      title: 'Без определяющего запроса',
      type: 'VIEW',
      properties: [{ name: 'name' }, { name: 'shape_area' }]
    }
  ],
  geometryType: GeometryType.MULTI_POLYGON
};
