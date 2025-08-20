import { Test, TestDefinition, TestDefinitionCallback } from 'hermione';
import { assert } from 'chai';

import { DataManagementPage } from '../../../objects/pages/DataManagement.page';
import { LibraryRegistry } from '../../../objects/blocks/Registry/Registry';
import { RegisterPage } from '../../../objects/pages/Register.page';
import { mockedLogin } from '../../../objects/commands/mockedLogin';
import { mockDataManagement } from '../_mock/dataManagement';

interface TestDefinitionWithOnly extends TestDefinition {
  only: TestDefinition;
}

declare const beforeEach: (callback?: TestDefinitionCallback) => Test;
declare const it: TestDefinitionWithOnly;

describe('Управление данными (табличное представление)', () => {
  describe('Взаимодействие с url', () => {
    /**
     * Background:
     *   Given Пользователь авторизован
     *   Given Пользователь находится на странице управления данными (табличное представление)
     */
    beforeEach(async function () {
      await mockedLogin(this.browser);

      const registerPage = new RegisterPage(this.browser);
      const libraryRegistry = new LibraryRegistry(this.browser);

      await mockDataManagement(this.browser);

      await registerPage.navigate();

      await this.browser.pause(5000);
      await libraryRegistry.waitForVisible();
    });

    /**
     * Scenario При загрузке страницы управления данными (табличное представление) состояние фильтров и сортировки записывается в адресную строку браузера
     *  When Страница управления данными (табличное представление) успешно отобразилась
     *  Then Состояние фильтров и сортировки записывается в адресную строку браузера
     */
    hermione.skip.in('chrome');
    it('При загрузке страницы управления данными (табличное представление) состояние фильтров и сортировки записывается в адресную строку браузера', async function () {
      const libraryRegistryDefaultUrl =
        'data-management/library/dl_default/registry?sort=%5B"title","asc"%5D&filter=%7B"is_folder":%7B"$in":%5Bnull,false%5D%7D%7D';
      const url = await this.browser.getUrl();
      assert.include(url, libraryRegistryDefaultUrl, 'Неправильный url при переходе на страницу управления данными');
    });

    /**
     * Scenario Адресная строка браузера изменяется при изменении состояния фильтра
     *   When Пользователь изменяет значение фильтра у столбца "Заголовок"
     *   Then В url записывается новое состояние фильтра
     */
    hermione.skip.in('chrome');
    it('Адресная строка браузера изменяется при изменении состояния фильтра', async function () {
      const completedTitleUrl =
        'data-management/library/dl_default/registry?sort=%5B"title","asc"%5D&filter=%7B"is_folder":%7B"$in":%5Bnull,false%5D%7D,"title":%7B"$ilike":"%25123%25"%7D%7D';

      const libraryRegistry = new LibraryRegistry(this.browser);
      await libraryRegistry.waitForVisible();
      await libraryRegistry.setTitleValue();

      const url = await this.browser.getUrl();
      assert.include(url, completedTitleUrl, 'Неправильный url при редактировании фильтра столбца Заголовок');
    });

    /**
     * Scenario Адресная строка браузера изменяется при изменении сортировки
     *   When Пользователь изменяет значение сортировки у столбца "Заголовок"
     *   Then В url записывается новое состояние сортировки
     */
    hermione.skip.in('chrome');
    it('Адресная строка браузера изменяется при изменении сортировки', async function () {
      const completedTitleUrl =
        '/data-management/library/dl_default/registry?sort=%5B%22title%22,%22desc%22%5D&filter=%7B%22is_folder%22:%7B%22$in%22:%5Bnull,false%5D%7D%7D';

      const libraryRegistry = new LibraryRegistry(this.browser);
      await libraryRegistry.waitForVisible();
      await libraryRegistry.changeSort();

      const url = await this.browser.getUrl();
      assert.include(url, completedTitleUrl, 'Неправильный url при изменении сортировки столбца Заголовок');
    });

    /**
     * Scenario Пользователь может перейти по ссылке на страницу страницу управления данными (табличное представление) с настроенными фильтрами и сортировкой
     *  When Пользователь переходит по ссылке на страницу управления данными (табличное представление) с настроенными фильтрами и сортировкой для столбца "Заголовок"
     *  Then Страница управления данными открывается с установленными настройками фильтров и сортировки у столбца "Заголовок"
     */
  });
});
