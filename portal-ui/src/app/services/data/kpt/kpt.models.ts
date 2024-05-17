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
      name: 'owner_doc',
      title: 'Орган отправивший документ',
      propertyType: PropertyType.STRING
    },
    {
      name: 'performer',
      title: 'Исполнитель',
      propertyType: PropertyType.USER_ID,
      defaultValue: currentUser.id,
      hidden: true
    },
    {
      name: 'receipt_type',
      title: 'Способ получение данных',
      minWidth: 400,
      readOnly: true,
      propertyType: PropertyType.CHOICE,
      defaultValue: 'Из файла',
      options: [{ title: 'Из файла', value: 'Из файла' }]
    },
    {
      name: 'date_order',
      title: 'Дата создания заказа',
      propertyType: PropertyType.DATETIME,
      hidden: true
    },
    {
      name: 'date_order_completion',
      title: 'Дата завершения заказа',
      propertyType: PropertyType.DATETIME,
      hidden: true
    },
    {
      name: 'source_doc',
      title: 'Версии',
      multiple: true,
      libraries: ['dl_data_kpt'],
      propertyType: PropertyType.DOCUMENT,
      description: 'Предыдущая версия данных',
      maxDocuments: 5,
      defaultValueWellKnownFormula: 'inherit'
    },
    {
      name: 'note',
      title: 'Примечание',
      propertyType: PropertyType.STRING
    }
  ]
};
