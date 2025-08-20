import { UploadFileInfo } from '../../../components/LibraryMassKptLoad/LibraryMassKptLoad';
import { currentUser } from '../../../stores/CurrentUser.store';
import { LibraryRecord } from '../library/library.models';
import { PropertySchema, PropertyType, Schema } from '../schema/schema.models';

export interface KptTaskInfo {
  id: number;
  folder: boolean;
  content: Record<string, string>;
}

export interface KptRequestInfo {
  clientId: string;
}

export interface UploadKptData {
  file: UploadFileInfo;
  data: LibraryRecord;
  libraryTableName: string;
  properties: PropertySchema[];
}

type Status = 'error' | 'success';

export interface UploadKptReturnType {
  status: Status;
  libraryRecord?: LibraryRecord;
}

export const kptMassUploadSchema: Schema = {
  name: 'dl_data_kpt',
  readOnly: false,
  title: 'Массовая загрузка КПТ',
  properties: [
    {
      name: 'performer',
      title: 'Исполнитель',
      propertyType: PropertyType.USER_ID,
      defaultValue: currentUser.id,
      hidden: true
    },
    {
      name: 'location',
      title: 'Местоположение',
      propertyType: PropertyType.STRING,
      hidden: true,
      defaultValueWellKnownFormula: 'inherit'
    },
    {
      name: 'note',
      title: 'Примечание',
      propertyType: PropertyType.STRING
    }
  ]
};
