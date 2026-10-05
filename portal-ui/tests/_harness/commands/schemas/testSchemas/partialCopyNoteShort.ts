import { PropertyType, type Schema } from '../../../../../src/app/services/data/schema/schema.models';
import { GeometryType } from '../../../../../src/app/services/geoserver/wfs/wfs.models';
import { systemProperties } from './_systemProperties';

export const partialCopyNoteShort: Schema = {
  name: 'partial_copy_note_short',
  title: 'для частичного копирования короткая',
  tableName: 'partial_copy_note_short',
  styleName: 'generic',
  properties: [
    {
      name: 'note',
      title: 'Примечание',
      propertyType: PropertyType.STRING,
      maxLength: 3
    },
    {
      name: 'shape',
      title: 'geometry',
      propertyType: PropertyType.GEOMETRY
    },
    ...systemProperties
  ],
  geometryType: GeometryType.MULTI_POLYGON
};
