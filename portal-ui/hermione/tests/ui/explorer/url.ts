import { Test, TestDefinition, TestDefinitionCallback } from 'hermione';
import { assert } from 'chai';

import { DataManagementPage } from '../../../objects/pages/DataManagement.page';
import { Explorer } from '../../../objects/blocks/Explorer/Explorer';
import { mockedLogin } from '../../../objects/commands/mockedLogin';
import { mockDataManagement } from '../_mock/dataManagement';
import { Toast } from '../../../objects/blocks/Toast/Toast';

interface TestDefinitionWithOnly extends TestDefinition {
  only: TestDefinition;
}

declare const beforeEach: (callback?: TestDefinitionCallback) => Test;
declare const it: TestDefinitionWithOnly;

describe('Управление данными', () => {
  describe('Взаимодействие с url', () => {
    /**
     * Background:
     *   Given Пользователь авторизован
     *   Given Пользователь находится на странице управления данными
     */
    beforeEach(async function () {
      await mockedLogin(this.browser);
      const dataManagementPage = new DataManagementPage(this.browser);
      await mockDataManagement(this.browser);
      await dataManagementPage.navigate();
      await dataManagementPage.waitForVisible();
    });

    it('Внешний вид', async function () {
      const explorer = new Explorer(this.browser);
      await explorer.waitForVisible();
      await this.browser.pause(500);
      await explorer.assertSelfie();
    });

    /**
     * Scenario Изменения в адресной строке браузера при изменении состояния Explorer
     *   When Открывается страница управление данными
     *   Then В url нет данных об элементах
     *   When Пользователь переходит внутрь раздела "Наборы данных"
     *   Then В url отображается путь к разделу "Наборы данных" с выбранным первым элементом
     *   When Пользователь выделяет второй элемент
     *   Then В url изменяется последний пункт
     */
    it('Изменения в адресной строке браузера при изменении состояния Explorer', async function () {
      const explorer = new Explorer(this.browser);
      await explorer.waitForVisible();
      const explorerPath = 'path_dm';
      const dataManagementPageUrl = await this.browser.getUrl();
      assert.notInclude(dataManagementPageUrl, explorerPath, 'Изменяет url при инициализации');

      await explorer.openFirstItem();

      const firstDatasetEtalon =
        'data-management?path_dm=%5B%22r%22,%22root%22,%22dr%22,%22datasetRoot%22,%22dataset%22,%22workspace_3%22%5D';
      const url = await this.browser.getUrl();
      assert.include(url, firstDatasetEtalon, 'Неправильный url при переходе в раздел');

      await explorer.selectSecondItem();
      const secondDatasetEtalon =
        'data-management?path_dm=%5B%22r%22,%22root%22,%22dr%22,%22datasetRoot%22,%22dataset%22,%22workspace_1077%22%5D';
      const changedUrl = await this.browser.getUrl();
      assert.notEqual(url, changedUrl, 'Url не изменился');
      assert.include(changedUrl, secondDatasetEtalon, 'Неправильный url при выделении элемента');
    });

    /**
     * Scenario При загрузке страницы начальное состояние Explorer считывается из адресной строки браузера
     *  When Пользователь переходит внутрь раздела "Наборы данных"
     *  And Пользователь выделяет второй элемент
     *  And Обновляет страницу приложения в браузере (F5)
     *  Then Explorer открывает тот же раздел и выделяет тот же элемент
     */
    it('При загрузке страницы начальное состояние Explorer считывается из адресной строки браузера', async function () {
      const explorer = new Explorer(this.browser);
      await explorer.waitForVisible();
      await explorer.openFirstItem();
      await explorer.selectSecondItem();
      const url = await this.browser.getUrl();
      const dataManagementPage = new DataManagementPage(this.browser);
      await dataManagementPage.navigate(new URL(url).search);

      await this.browser.pause(1000);
      await explorer.assertSelfie();
    });

    /**
     * Scenario Навигация по истории браузера
     *  When Пользователь переходит внутрь раздела "Наборы данных"
     *  And Пользователь выделяет второй элемент
     *  And Нажимает кнопку "Назад" в браузере
     *  Then Explorer возвращается на начальную страницу управления данными
     *  When Нажимает кнопку "Вперёд" в браузере
     *  Then Explorer переходит внутрь внутрь раздела "Наборы данных"
     */
    hermione.skip.in('chrome', 'работает нестабильно');
    it('Навигация по истории браузера', async function () {
      const explorer = new Explorer(this.browser);
      await explorer.waitForVisible();
      const startUrl = await this.browser.getUrl();
      await explorer.openFirstItem();
      await explorer.selectSecondItem();
      await this.browser.pause(500);
      const finishUrl = await this.browser.getUrl();
      await this.browser.back();
      await this.browser.pause(500);

      assert.include(await this.browser.getUrl(), startUrl, 'Неправильный url');
      await explorer.assertSelfie('back');

      await this.browser.forward();
      await this.browser.pause(300);

      await explorer.assertSelfie('forward');
      assert.include(await this.browser.getUrl(), finishUrl, 'Неправильный url');
    });

    /**
     * Scenario Частичное восстановление состояния
     *  When Пользователь переходит по изменённому адресу на несуществующий элемент наборов данных
     *  Then Explorer восстанавливает состояние частично: открытым для просмотра элементом будет последний
     *      валидный элемент в цепочке описанный в адресе элементов, выделенным элементом будет первый дочерний элемент открытого
     *  And Показано Toast уведомление (warning) о недоступности запрашиваемого элемента
     */
    it('Частичное восстановление состояния', async function () {
      const explorer = new Explorer(this.browser);
      const dataManagementPage = new DataManagementPage(this.browser);
      const notCorrectUrl =
        '?path_dm=%5B"r","root","dr","datasetRoot","dataset","workspace_457","table","WRONG:oks_457_87c8"%5D&opts_dm=%5B0,10,"created_at","desc",%7B%7D%5D';
      const etalonTitle = 'Краснополянское сельское поселение';

      await explorer.waitForVisible();
      await this.browser.pause(500);
      await dataManagementPage.navigate(notCorrectUrl);
      await this.browser.pause(1000);

      const currentTitle = await explorer.getTitle();

      assert.equal(etalonTitle, currentTitle, 'Открылся неправильный элемент');

      const toast = new Toast(this.browser);
      await toast.waitForVisible();
    });

    /**
     * Scenario Выделение элемента на определённой странице
     *  When Пользователь переходит по ссылке на второй элемент 3 страницы внутри раздела "Наборы данных"
     *  Then Explorer открывает второй элемент 3 страницы внутри раздела "Наборы данных"
     */
    hermione.skip.in('chrome');
    it('Выделение элемента на определённой странице', async function () {
      const explorer = new Explorer(this.browser);
      const dataManagementPage = new DataManagementPage(this.browser);
      const url =
        '?path_dm=%5B"r","root","dr","datasetRoot","dataset","workspace_457","empty","empty"%5D&opts_dm=%5B2,5,"created_at","asc",%7B%7D%5D';
      const etalonTitle = 'Железнодорожненское сельское поселение';

      await dataManagementPage.navigate(url);
      await this.browser.pause(2000);

      const currentTitle = await explorer.getTitle();
      assert.equal(etalonTitle, currentTitle, 'Открылся неправильный элемент');
    });

    /**
     * Scenario Выделение элемента на неправильной странице
     *  When Пользователь переходит по ссылке на второй элемент 2 страницы внутри раздела "Наборы данных"
     *  Then Explorer открывает второй элемент 3 страницы внутри раздела "Наборы данных"
     *  And Ошибок никаких не выводит
     */
    hermione.skip.in('chrome');
    it('Выделение элемента на неправильной странице', async function () {
      const etalonUrl =
        '?explorerPath_DataManagement=%5B%5B%22root%22,%22root%22%5D,%5B%22datasetRoot%22,%22dataSetRoot%22%5D,%5B%22dataset%22,%22workspace_823%22,2%5D%5D&explorerOptions_DataManagement=%5B10,%22created_at%22,%22asc%22,%7B%7D%5D';
      const etalonTitle = 'Железнодорожненское сельское поселение';

      await mockedLogin(this.browser);
      const dataManagementPage = new DataManagementPage(this.browser);
      await mockDataManagement(this.browser);
      await dataManagementPage.navigate(etalonUrl);
      await this.browser.pause(2000);

      const explorer = new Explorer(this.browser);
      const currentTitle = await explorer.getTitle();
      assert.equal(etalonTitle, currentTitle, 'Открылся неправильный элемент');

      const currentUrl = await this.browser.getUrl();
      assert.include(currentUrl, etalonUrl, 'Неправильный url');

      const toast = new Toast(this.browser);
      assert.isNotOk(await toast.isVisible(), 'Появился Toast');
    });

    /**
     * Scenario Выделение элемента на несуществующей странице
     *  When Пользователь переходит по ссылке на второй элемент 9999 страницы внутри раздела "Наборы данных"
     *  Then Explorer открывает второй элемент 3 страницы внутри раздела "Наборы данных"
     *  And Ошибок никаких не выводит
     */
    hermione.skip.in('chrome');
    it('Выделение элемента на несуществующей странице', async function () {
      const etalonUrl =
        '?explorerPath_DataManagement=%5B%5B%22root%22,%22root%22%5D,%5B%22datasetRoot%22,%22dataSetRoot%22%5D,%5B%22dataset%22,%22workspace_823%22,9999%5D%5D&explorerOptions_DataManagement=%5B10,%22created_at%22,%22asc%22,%7B%7D%5D';
      const etalonTitle = 'Железнодорожненское сельское поселение';

      await mockedLogin(this.browser);
      const dataManagementPage = new DataManagementPage(this.browser);
      await mockDataManagement(this.browser);
      await dataManagementPage.navigate(etalonUrl);
      await this.browser.pause(2000);

      const explorer = new Explorer(this.browser);
      const currentTitle = await explorer.getTitle();
      assert.equal(etalonTitle, currentTitle, 'Открылся неправильный элемент');

      const toast = new Toast(this.browser);
      assert.isNotOk(await toast.isVisible(), 'Появился Toast');
    });

    /**
     * Scenario Восстановление состояния фильтра, сортировки и размера страниц
     *  When Пользователь переходит по ссылке на элемент с настроенными фильтрами
     *  Then Explorer открывается с теми же настройками сортировки, размера страниц и фильтра и выбранным элементом
     */
    hermione.skip.in('chrome');
    it('Восстановление состояния фильтра, сортировки и размера страниц', async function () {
      const etalonUrl =
        '?explorerPath_DataManagement=%5B%5B"root","root"%5D,%5B"datasetRoot","dataSetRoot"%5D,%5B"dataset","dataset_ad483a",0%5D%5D&explorerOptions_DataManagement=%5B5,"title","desc",%7B"title":"Мир"%7D%5D';
      const etalonTitle = 'парк Эмира Бухарского';
      const etalonFilter = 'Мир';
      const etalonSort = 'title';
      const etalonSortDir = 'По убыванию';
      const etalonPageSize = '5';

      await mockedLogin(this.browser);
      const dataManagementPage = new DataManagementPage(this.browser);
      await mockDataManagement(this.browser);
      await dataManagementPage.navigate(etalonUrl);
      await this.browser.pause(1000);

      const explorer = new Explorer(this.browser);
      assert.equal(await explorer.getFilterValue(), etalonFilter, 'Неверный фильтр');
      assert.equal(await explorer.getSortValue(), etalonSort, 'Неверная сортировка 1');
      assert.equal(await explorer.getSortDirValue(), etalonSortDir, 'Неверная сортировка 2');
      assert.equal(await explorer.getPageSizeValue(), etalonPageSize, 'Неверная настройка количества страниц');

      const currentTitle = await explorer.getTitle();
      assert.equal(etalonTitle, currentTitle, 'Открылся неправильный элемент');
    });
  });
});
