import { isEqual } from 'lodash';
import { When, Then } from '@wdio/cucumber-framework';

import { attributesBlock } from './Attributes.block';
import { layersSidebarBlock } from '../LayersSidebar/LayersSidebar.block';

import { ScenarioScope } from '../../scenarioScope';
import { getSortDirection } from '../../getSortDirection';
import { sortObjects } from '../../../../src/app/services/util/sortObjects';

const waitUntilOptions = {
  timeout: 10_000,
  timeoutMsg: 'Результат не был достигнут после 10 секунд ожидания'
};

Then(/^в атрибутивной таблице отображается только колонка "(.*)"$/, async (title: string) => {
  await attributesBlock.checkTableSingleColTitle(title);
});

Then(/^открылась атрибутивная таблица слоя "(.*)"$/, async (title: string) => {
  expect(await attributesBlock.getTitle()).toEqual(title);
});

Then('открыта атрибутивная таблица созданного слоя', async function (this: ScenarioScope) {
  await layersSidebarBlock.clickLayerBurger();
  await layersSidebarBlock.clickLayerAttributeTable();

  expect(await attributesBlock.getTitle()).toEqual(this.latestLayer.title);
});

When(
  'в атрибутивной таблице я сортирую по атрибуту: {string} в порядке: {string}',
  async function (title: string, directionTitle: string) {
    await attributesBlock.sortColumn(title, getSortDirection(directionTitle));
  }
);

Then(
  'сортировка в атрибутивной таблице для атрибута: {string} соответствует ожидаемому: {string}',
  async function (title: string, expectedAsString: string) {
    await browser.waitUntil(async () => {
      const values = await attributesBlock.getColValues(title);

      return isEqual(values, expectedAsString.split(','));
    }, waitUntilOptions);
  }
);

When('в атрибутивной таблице перехожу на страницу {int}', async function (pageNumber: number) {
  await attributesBlock.clickPaginationItem(pageNumber);
});

Then(
  'сортировка в атрибутивной таблице корректна по атрибуту: {string} на странице {int}',
  async function (this: ScenarioScope, attributeTitle: string, pageNumber: string) {
    const defaultPageSize = 20;

    const property = this.latestSchema.properties?.find(prop => {
      return prop.title === attributeTitle;
    });

    if (!property) {
      throw new Error(`Свойство ${attributeTitle} не найдено`);
    }

    const featureProperties = this.latestFeatures.map(feature => {
      return feature.properties;
    });

    const start = defaultPageSize * (Number(pageNumber) - 1);
    const end = defaultPageSize * Number(pageNumber);

    const result = sortObjects(featureProperties, property.name, true)
      .slice(start, end)
      .map(prop => {
        return String(prop[property.name]);
      });

    await browser.waitUntil(async () => {
      const values = await attributesBlock.getColValues(attributeTitle);

      return values.length && isEqual(values, result);
    }, waitUntilOptions);
  }
);
