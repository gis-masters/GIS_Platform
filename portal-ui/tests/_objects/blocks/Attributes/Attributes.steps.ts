import { isEqual } from 'lodash';
import { WaitUntilOptions } from 'webdriverio';
import { DataTable, Then, When } from '@wdio/cucumber-framework';

import { attributesBlock } from './Attributes.block';

import { ScenarioScope } from '../../ScenarioScope';
import { getSortDirection } from '../../getSortDirection';
import { sortObjects } from '../../../../src/app/services/util/sortObjects';
import { PropertySchema, PropertyType, Schema } from '../../../../src/app/services/data/schema/schema.models';
import { layersSidebarBlock } from '../LayersSidebar/LayersSidebar.block';

const waitUntilOptions: WaitUntilOptions = {
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
  async function (this: ScenarioScope, title: string, expectedAsString: string) {
    const columnType = await attributesBlock.getColumnType(title);

    await browser.waitUntil(async () => {
      let values: string[];
      if (columnType.toLowerCase() === PropertyType.BOOL.toLowerCase()) {
        const result = await attributesBlock.getBooleanColValues(title);

        values = result.map(String);
      } else {
        values = await attributesBlock.getColValues(title);
      }

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

    const featureProperties = this.latestFeatures.map(feature => {
      return feature.properties;
    });
    const property = getSchemaPropertyByTitle(this.latestSchema, attributeTitle);
    const start = defaultPageSize * (Number(pageNumber) - 1);
    const end = defaultPageSize * Number(pageNumber);

    const result = sortObjects(featureProperties, property.name, true)
      .slice(start, end)
      .map(prop => {
        return String(prop[property.name]);
      });

    await browser.pause(200); // Бага в browser
    await browser.waitUntil(async () => {
      const values = await attributesBlock.getColValues(attributeTitle);

      return values.length && isEqual(values, result);
    }, waitUntilOptions);
  }
);

Then('сортировка в атрибутивной таблице недоступна для свойств имеющих тип:', async function (data: DataTable) {
  const titles = data.raw().map(item => item[0]);

  for (const title of titles) {
    expect(await attributesBlock.isColumnSortable(title)).toEqual(false);
  }
});

function getSchemaPropertyByTitle(schema: Schema, title: string): PropertySchema {
  const property = schema.properties?.find(prop => {
    return prop.title === title;
  });

  if (!property) {
    throw new Error(`Свойство: ${title} не найдено в схеме: ${schema.name ?? ''}`);
  }

  return property;
}
