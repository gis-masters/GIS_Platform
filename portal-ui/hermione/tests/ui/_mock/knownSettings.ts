/// <reference path='../../../../node_modules/hermione/typings/webdriverio/index.d.ts' />

import { mockApi } from '../../../objects/commands/mockApi';

export async function mockKnownSettings(browser: WebdriverIO.Browser) {
  await mockApi(browser, {
    method: 'get',
    url: /.*organizations\/known-settings$/,
    status: 200,
    response: JSON.stringify({
      downloadXml: 'Скачивание xml межевого плана и выгрузка координат и геометрии',
      createLibraryItem: 'Создание элементов в библиотеке',
      editProjectLayer: 'Настройка слоев проекта',
      viewDocumentLibrary: 'Доступность библиотек документов',
      viewBugReport: 'Проверка ошибок по приказу',
      showPermissions: 'Настройка разрешений в админке',
      downloadGml: 'Выгрузка GML',
      importShp: 'Импорт SHP архивов',
      viewServicesCalculator: 'Калькулятор предоставления сведений',
      createProject: 'Создание проекта',
      taskManagement: 'Управление задачами',
      downloadFiles: 'Скачать документ'
    })
  });
}
