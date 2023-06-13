import { isEqual } from 'lodash';
import { WaitUntilOptions } from 'webdriverio';
import { Given, Then, When } from '@wdio/cucumber-framework';
import { DataTable } from '@cucumber/cucumber';

import { ScenarioScope } from '../../ScenarioScope';
import { getSortDirection } from '../../utils/getSortDirection';
import { layersSidebarBlock } from '../LayersSidebar/LayersSidebar.block';
import { sortObjects } from '../../../../src/app/services/util/sortObjects';
import { PropertySchema, PropertyType, Schema } from '../../../../src/app/services/data/schema/schema.models';
import { getAttributesTableFilter } from '../../commands/attributesTable/getAttributesTableFilter';
import { getVectorTableByTitle } from '../../commands/tables/getVectorTableByTitle';

import { attributesBlock } from './Attributes.block';

const waitUntilOptions: WaitUntilOptions = {
  timeout: 10_000,
  timeoutMsg: 'Результат не был достигнут после 10 секунд ожидания'
};

Then('атрибутивная таблица закрыта', async () => {
  await attributesBlock.waitForBarHidden();
});

Then('в атрибутивной таблице отображается только колонка {string}', async (title: string) => {
  await attributesBlock.checkTableSingleColTitle(title);
});

Then('открылась атрибутивная таблица слоя {string}', async (title: string) => {
  await expect(await attributesBlock.getTitle()).toEqual(title);
});

Then('нажимаю на переключатель применения фильтрации в атрибутивной таблице', async () => {
  await attributesBlock.clickFiltersEnabler();
});

Then('открыта атрибутивная таблица созданного слоя', async function (this: ScenarioScope) {
  await layersSidebarBlock.openAttributeTable(this.latestLayer.title);

  await browser.waitUntil(async () => {
    return (await attributesBlock.getTitle()) === this.latestLayer.title;
  });

  await attributesBlock.waitForLoadingDisappear();
  await attributesBlock.waitForTableVisible();
});

Given('открыта атрибутивная таблица слоя {string}', async (layerName: string) => {
  await layersSidebarBlock.openAttributeTable(layerName);

  await browser.waitUntil(async () => {
    return (await attributesBlock.getTitle()) === layerName;
  });

  await attributesBlock.waitForTableVisible();
  await attributesBlock.waitForLoadingDisappear();
});

When(
  'в атрибутивной таблице я сортирую по атрибуту {string} в порядке {string}',
  async function (title: string, directionTitle: string) {
    await attributesBlock.xTable.sortColumn(title, getSortDirection(directionTitle));
  }
);

When(
  'в атрибутивной таблице я фильтрую по атрибуту {string} от {string} до {string}',
  async function (this: ScenarioScope, colTitle: string, lte: string, gte: string) {
    await attributesBlock.xTable.filterNumerableColumn(colTitle, lte, gte);
    this.latestFilter = await getAttributesTableFilter();
  }
);

When('в атрибутивной таблице я фильтрую по выделению оставляя только выделенные', async function () {
  await attributesBlock.filterBySelection(true);
});

When('в атрибутивной таблице я фильтрую по выделению оставляя только НЕ выделенные', async function () {
  await attributesBlock.filterBySelection(false);
});

When(
  'в атрибутивной таблице в фильтре поля {string} типа CHOICE я выбираю {string}',
  async function (colTitle: string, optionTitle: string) {
    await attributesBlock.xTable.filterChoiceColumn(colTitle, optionTitle);
  }
);

When('я сворачиваю атрибутивную таблицу', async function () {
  await attributesBlock.minimize();
});

When('я закрываю вкладку атрибутивной таблицы созданного слоя', async function (this: ScenarioScope) {
  await attributesBlock.closeTab(this.latestLayer.title);
});

When('я нажимаю на таб созданного слоя в атрибутивной таблице', async function (this: ScenarioScope) {
  await attributesBlock.clickTab(this.latestLayer.title);
});

When(
  'в атрибутивной таблице я ввожу в фильтр строкового поля {string} значение {string}',
  async function (this: ScenarioScope, colTitle: string, filter: string) {
    await attributesBlock.xTable.filterStringColumn(colTitle, filter);

    this.latestFilter = await getAttributesTableFilter();
    await attributesBlock.waitForLoadingDisappear();
  }
);

When(
  'в атрибутивной таблице я ввожу в фильтр поля типа document {string} значение {string}',
  async (colTitle: string, filter: string) => {
    await attributesBlock.xTable.filterDocumentColumn(colTitle, filter);
  }
);

When('в атрибутивной таблице я перехожу во вкладку таблицы {string}', async function (title: string) {
  await attributesBlock.selectTab(title);

  await attributesBlock.waitForLoadingDisappear();
});

Then(
  'в атрибутивной таблице {string} настроенные фильтры не изменились',
  async function (this: ScenarioScope, title: string) {
    const currentFilter = await getAttributesTableFilter();
    const table = await getVectorTableByTitle(this.latestDataset.identifier, title);

    await expect(JSON.stringify(currentFilter[table.identifier])).toEqual(
      JSON.stringify(this.latestFilter[table.identifier])
    );
  }
);

Then(
  'сортировка в атрибутивной таблице для атрибута {string} соответствует ожидаемому: {string}',
  async function (title: string, expectedAsString: string) {
    const columnType = await attributesBlock.xTable.getColumnType(title);

    await browser.waitUntil(async () => {
      let values: string[];
      if (columnType.toLowerCase() === PropertyType.BOOL.toLowerCase()) {
        const result = await attributesBlock.xTable.getBooleanColValues(title);

        values = result.map(String);
      } else {
        values = await attributesBlock.xTable.getColValues(title);
      }

      return isEqual(values.filter(Boolean), expectedAsString.split(', ').filter(Boolean));
    }, waitUntilOptions);
  }
);

Then(
  'результат фильтрации в атрибутивной таблице по полю {string} соответствует ожидаемому {string}',
  async function (colTitle: string, expectedAsString: string) {
    await browser.pause(200); // бага в browser.waitUntil
    await browser.waitUntil(async () => {
      const values = await attributesBlock.xTable.getColValues(colTitle);

      return isEqual(values, expectedAsString.split(', ').filter(Boolean));
    }, waitUntilOptions);
  }
);

When('в атрибутивной таблице перехожу на страницу {int}', async function (pageNumber: number) {
  await attributesBlock.clickPaginationItem(pageNumber);
});

Then(
  'сортировка в атрибутивной таблице корректна по атрибуту {string} на странице {int}',
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
      const values = await attributesBlock.xTable.getColValues(attributeTitle);

      return values.length && isEqual(values, result);
    }, waitUntilOptions);
  }
);

Then('сортировка в атрибутивной таблице недоступна для следующих колонок:', async function (data: DataTable) {
  const titles = data.raw().map(item => item[0]);

  for (const title of titles) {
    await expect(await attributesBlock.xTable.isColumnSortable(title)).toEqual(false);
  }
});

Then('фильтрация в атрибутивной таблице недоступна для следующих колонок:', async function (data: DataTable) {
  const titles = data.raw().map(item => item[0]);

  for (const title of titles) {
    await expect(await attributesBlock.xTable.isColumnFilterable(title)).toEqual(false);
  }
});

Then(
  'в атрибутивной таблице фильтр атрибута {string} заполнен значением {string}',
  async function (attributeTitle: string, expected: string) {
    await browser.waitUntil(async () => {
      const actual = await attributesBlock.xTable.getFilterValue(attributeTitle);

      return actual === expected;
    }, waitUntilOptions);
  }
);

Then('в атрибутивной таблице существуют вкладки с заголовками:', async function (attributeTitle: DataTable) {
  const titles = await attributesBlock.getTabsTitles();
  await expect(titles).toEqual(attributeTitle.raw()[0]);
});

When('в атрибутивной таблице я нажимаю `Копировать N объектов в другой слой`', async function () {
  await attributesBlock.clickCopyFeaturesButton();
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
