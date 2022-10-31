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
      dataManagement: 'Управление данными',
      createProject: 'Создание проекта',
      downloadFiles: 'Скачать документ'
    })
  });
}
