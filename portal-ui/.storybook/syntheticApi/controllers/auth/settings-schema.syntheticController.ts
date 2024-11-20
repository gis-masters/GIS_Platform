import { InternalAxiosRequestConfig } from 'axios';

import { SyntheticController } from '../masterController';
import { err404 } from '../../utils';
import { PropertyType, Schema } from '../../../../src/app/services/data/schema/schema.models';

class SettingsSchemaSyntheticController implements SyntheticController {
  pattern = /^.*\/organizations\/settings\/schema$/;

  get(config: InternalAxiosRequestConfig): Schema {
    if (!config.url) {
      throw err404(config);
    }

    return {
      name: 'org_settings',
      title: 'Настройки организации',
      tableName: 'org_settings',
      properties: [
        {
          name: 'createLibraryItem',
          title: 'Создание элементов в библиотеке',
          propertyType: PropertyType.BOOL,
          defaultValue: false
        },
        {
          name: 'viewDocumentLibrary',
          title: 'Доступность библиотек документов',
          propertyType: PropertyType.BOOL,
          defaultValue: false
        },
        {
          name: 'viewServicesCalculator',
          title: 'Калькулятор предоставления сведений',
          propertyType: PropertyType.BOOL,
          defaultValue: false
        },
        {
          name: 'importShp',
          title: 'Импорт SHP архивов',
          propertyType: PropertyType.BOOL,
          defaultValue: false
        },
        {
          name: 'viewBugReport',
          title: 'Проверка ошибок по приказу',
          propertyType: PropertyType.BOOL,
          defaultValue: false
        },
        {
          name: 'showPermissions',
          title: 'Настройка разрешений в админке',
          propertyType: PropertyType.BOOL,
          defaultValue: false
        },
        {
          name: 'downloadGml',
          title: 'Выгрузка GML',
          propertyType: PropertyType.BOOL,
          defaultValue: false
        },
        {
          name: 'downloadXml',
          title: 'Скачивание xml межевого плана и выгрузка координат и геометрии',
          propertyType: PropertyType.BOOL,
          defaultValue: false
        },
        {
          name: 'downloadFiles',
          title: 'Скачивание файлов',
          propertyType: PropertyType.BOOL,
          defaultValue: false
        },
        {
          name: 'createProject',
          title: 'Создание проекта',
          propertyType: PropertyType.BOOL,
          defaultValue: false
        },
        {
          name: 'editProjectLayer',
          title: 'Настройка слоев проекта',
          propertyType: PropertyType.BOOL,
          defaultValue: false
        },
        {
          name: 'sedDialog',
          title: 'СЭД Диалог',
          propertyType: PropertyType.BOOL,
          defaultValue: false
        },
        {
          name: 'reestrs',
          title: 'Реестры',
          propertyType: PropertyType.BOOL,
          defaultValue: false
        },
        {
          name: 'taskManagement',
          title: 'Управление задачами',
          propertyType: PropertyType.BOOL,
          defaultValue: false
        },
        {
          name: 'tags',
          title: 'Управление схемами',
          propertyType: PropertyType.CHOICE,
          multiple: true,
          description: 'Схема будет доступна если содержит хотя бы один из разрешенных тегов',
          options: [
            {
              value: 'Приказ 10',
              title: 'Приказ 10'
            },
            {
              value: 'Приказ 123',
              title: 'Приказ 123'
            },
            {
              value: 'settings',
              title: 'settings'
            }
          ]
        }
      ],
      description: 'Описание настроек организации',
      readOnly: false
    };
  }
}

export const settingsSchemaSyntheticController = new SettingsSchemaSyntheticController();
