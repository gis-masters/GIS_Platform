import { ContentType, Schema } from '../../../services/data/schema/schema.models';
import { Role } from '../../../services/data/permissions/permissions.models';
import { currentUser } from '../../../stores/CurrentUser.store';
import { ContentTypeTypes, LibraryRecord } from '../../../services/data/library/library.models';
import { applyContentType } from '../../../services/data/schema/schema.utils';

function getContentType(libraryRecord: LibraryRecord): ContentType {
  return {
    id: 'kpt_mass_load',
    type: ContentTypeTypes.FOLDER,
    title: 'Массовая загрузка КПТ',
    properties: [
      { name: 'order_number' },
      { name: 'title', title: 'Кадастровый квартал', required: false },
      { name: 'performer', defaultValue: currentUser.id, readOnly: true },
      {
        name: 'receipt_type',
        defaultValue: 'Из файла',
        options: [{ title: 'Из файла', value: 'Из файла' }],
        readOnly: true
      },
      { name: 'fias', defaultValue: libraryRecord.fias__address, required: false },
      {
        name: 'status',
        defaultValue: 'Исполнено',
        options: [{ title: 'Исполнено', value: 'Исполнено' }],
        readOnly: true
      },
      { name: 'date_order', defaultValue: `${libraryRecord.created_at?.slice(0, 11).trim()}`, readOnly: true },
      {
        name: 'date_order_completion',
        defaultValue: `${(libraryRecord.last_modified as string).slice(0, 11).trim()}`,
        readOnly: true
      },
      { name: 'source_doc' },
      { name: 'note' }
    ]
  };
}

export function havePermissionsForEdit(role?: Role): boolean {
  return currentUser.isAdmin || (!!role && [Role.CONTRIBUTOR, Role.OWNER].includes(role));
}

export const applyCustomContentType = ({
  schema,
  libraryRecord
}: {
  schema: Schema;
  libraryRecord: LibraryRecord;
}): Schema => {
  const contentType: ContentType = getContentType(libraryRecord);

  const contentTypes = schema.contentTypes ? [...schema.contentTypes, contentType] : [contentType];

  const newSchema = { ...schema, contentTypes };

  return applyContentType(newSchema, 'kpt_mass_load');
};
