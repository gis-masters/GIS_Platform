import { InternalAxiosRequestConfig } from 'axios';

import { SyntheticController } from '../masterController';
import { err404 } from '../../utils';

class KnownSettingsSyntheticController implements SyntheticController {
  pattern = /^.*\/organizations\/known-settings$/;

  get(config: InternalAxiosRequestConfig): Record<string, string> {
    if (!config.url) {
      throw err404(config);
    }

    return {
      downloadXml: 'Скачивание xml межевого плана и выгрузка координат и геометрии',
      createLibraryItem: 'Создание элементов в библиотеке',
      reestrs: 'Реестры',
      editProjectLayer: 'Настройка слоев проекта',
      sedDialog: 'СЭД Диалог',
      taskManagement: 'Управление задачами',
      dataManagement: 'Управление данными',
      createProject: 'Создание проекта',
      prikaz_123: 'Приказ 123',
      prikaz_10: 'Приказ 10',
      downloadFiles: 'Скачать документ'
    };
  }
}

export const knownSettingsSyntheticController = new KnownSettingsSyntheticController();
