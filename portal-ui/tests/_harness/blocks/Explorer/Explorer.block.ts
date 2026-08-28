import { ExplorerItemType } from '../../../../src/app/components/Explorer/Explorer.models';
import { sleep } from '../../../../src/app/services/util/sleep';
import { isArray } from '../../../../src/app/services/util/typeGuards/isArray';
import { Block } from '../../classes/Block';
import { hasClass } from '../../commands/hasClass';
import { FormBlock } from '../Form/Form.block';
import { MuiInputBlock } from '../MuiInput/MuiInput.block';
import { MuiSelectBlock } from '../MuiSelect/MuiSelect.block';

const EXPLORER_ROLE = 'dm';

const explorerSectionPath: Record<string, readonly [string, string]> = {
  'Наборы данных': [ExplorerItemType.DATASET_ROOT, 'datasetRoot']
};

const explorerDatasetIdentifier: Record<string, string> = {
  'г.о. Симферополь': 'dataset_simferopol',
  'Восток Крыма': 'dataset_crimea_east'
};

const nonexistentTableId = 'WRONG:nonexistent';

function isExplorerUrlPath(value: unknown): value is string[] {
  return isArray(value) && value.every(item => typeof item === 'string');
}

export class ExplorerBlock extends Block {
  selectors = {
    root: '.Explorer',
    item: '.Explorer-Item',
    disabledItem: '.Explorer-Item.Mui-disabled',
    title: '.Explorer-ItemTitle',
    loader: '.Explorer .Loading',
    viewContentWidget: '.Explorer .ViewContentWidget',
    empty: '.Explorer-Empty',
    infoTitle: '.Explorer-InfoTitle',
    search: '.Explorer-Search',
    searchSubmit: '.Explorer-SearchSubmit',
    createLayerBtn: '.Explorer-ToolbarActions .MuiButtonBase-root[aria-label="Создать векторную таблицу"]',
    firstItem: '.Explorer-List .Explorer-Item:first-child',
    secondItemTitle: '.Explorer-List .Explorer-Item:last-child .MuiListItemText-primary',
    connectionToProject: '.Explorer .ConnectionsToProjectsWidget button',
    paginationSelectedPage: '.Explorer-Pagination .MuiPaginationItem-page.Mui-selected',
    filter: '.Explorer-Filter',
    sort: '.Explorer-Sort',
    sortOrder: '.Explorer-Sort button',
    pageSize: '.Explorer-PageSize'
  };

  async openExplorerItem(title: string): Promise<void> {
    const $item = await this.getExplorerItemByTitle(title);
    if (!$item) {
      throw new Error(`Не найден элемент "${title}"`);
    }

    await $item.doubleClick();
    await sleep(500); // ждем анимации перехода
  }

  async selectExplorerItem(item: string): Promise<void> {
    await this.waitForVisible();

    const $item = await this.getExplorerItemByTitle(item);
    if (!$item) {
      throw new Error(`Не найден элемент "${item}"`);
    }

    await $item.click();
  }

  async allItemsAreDisabled(): Promise<boolean> {
    const $root = await this.findBySelector('root');
    await $root.waitForDisplayed();

    await this.waitForLoading();

    const $$explorerItems = await this.findAllBySelector('item');
    const $$explorerDisablesItems = await this.findAllBySelector('disabledItem');

    return $$explorerItems.length === $$explorerDisablesItems.length;
  }

  async selectFirstExplorerItem(): Promise<void> {
    const $firstItem = await this.findBySelector('firstItem');
    await $firstItem.waitForDisplayed();

    await $firstItem.click();
  }

  async getContentWidgetFieldValue(field: string): Promise<string> {
    const formBlock = new FormBlock(await this.findBySelector('viewContentWidget'));
    const $field = await formBlock.getField(field);

    return $field.$('.Form-View').getText();
  }

  async getContentWidgetField(field: string): Promise<WebdriverIO.Element> {
    const $contentWidget = await this.findBySelector('viewContentWidget');
    await $contentWidget.waitForDisplayed();
    const formBlock = new FormBlock($contentWidget);

    return await formBlock.getField(field);
  }

  async getExplorerItemsLength(): Promise<number> {
    await this.waitForVisible();
    await this.waitForLoading();

    const $$explorerItems = await this.findAllBySelector('item');

    return $$explorerItems.length;
  }

  async addToProject(): Promise<void> {
    const $connectionToProject = await this.findBySelector('connectionToProject');
    await $connectionToProject.click();
  }

  async clickCreateLayerBtn(): Promise<void> {
    const $createLayerBtn = await this.findBySelector('createLayerBtn');

    await $createLayerBtn.click();
  }

  async isCreateLayerBtnExist(): Promise<boolean> {
    const $createLayerBtn = await this.findBySelector('createLayerBtn');

    return await $createLayerBtn.isExisting();
  }

  async getListTitles(): Promise<string[]> {
    const $title = await this.findBySelector('title');
    await $title.waitForDisplayed();
    const $$titles = [...(await this.findAllBySelector('title'))];

    return await Promise.all($$titles.map(async $title => await $title.getText()));
  }

  async testEmptiness(): Promise<void> {
    const $empty = await this.findBySelector('empty');
    await $empty.waitForDisplayed();
  }

  async getExplorerItemByTitle(title: string): Promise<WebdriverIO.Element> {
    await this.waitForVisible();
    await this.waitForLoading();

    const $$explorerItems = await this.findAllBySelector('item');
    for (const $explorerItem of $$explorerItems) {
      const explorerItemName = await $explorerItem.$('.Explorer-ItemTitle').getText();

      if (explorerItemName === title) {
        return $explorerItem;
      }
    }

    throw new Error('Не найдет элемент: ' + title);
  }

  async getExplorerItemById(id: string): Promise<WebdriverIO.Element> {
    await this.waitForVisible();
    await this.waitForLoading();

    const $$explorerItems = await this.findAllBySelector('item');
    for (const $explorerItem of $$explorerItems) {
      const $itemId = await $explorerItem.$('.MuiListItemText-secondary').getElement();
      const currentId = await $itemId.getText();

      if (currentId === id) {
        return $explorerItem;
      }
    }

    throw new Error('Не найден элемент с id ' + id);
  }

  async waitForDocumentTitle(id: string, expectedTitle: string): Promise<void> {
    await browser.waitUntil(
      async () => {
        try {
          const $item = await this.getExplorerItemById(id);
          const $title = await $item.$('.Explorer-ItemTitle').getElement();
          const actualTitle = await $title.getText();

          return actualTitle === expectedTitle;
        } catch {
          return false;
        }
      },
      {
        timeout: 5000,
        timeoutMsg: `Документ с id ${id} не отображается с названием "${expectedTitle}"`
      }
    );
  }

  async clickEditButton(): Promise<void> {
    const $editButton = await $('button[aria-label="Редактировать"]').getElement();
    await $editButton.waitForDisplayed();
    await $editButton.click();
  }

  async setSearchValue(value: string): Promise<void> {
    const $search = await this.findBySelector('search');

    const searchInputBlock = new MuiInputBlock($search);
    await searchInputBlock.clearValue();
    await searchInputBlock.setValue(value);
  }

  async clickSearchSubmit(): Promise<void> {
    const $searchSubmit = await this.findBySelector('searchSubmit');
    await $searchSubmit.click();
  }

  async selectExplorerItemWithSecondaryContaining(fragment: string): Promise<void> {
    await this.waitForVisible();
    await this.waitForLoading();

    const $$explorerItems = await this.findAllBySelector('item');
    for (const $explorerItem of $$explorerItems) {
      const secondary = await $explorerItem.$('.MuiListItemText-secondary').getText();
      if (secondary.includes(fragment)) {
        await $explorerItem.click();

        return;
      }
    }

    throw new Error(`Не найден элемент explorer с подписью, содержащей "${fragment}"`);
  }

  async explorerListTitlesExclude(title: string): Promise<boolean> {
    const titles = await this.getListTitles();

    return !titles.includes(title);
  }

  async assertNoExplorerStateInUrl(): Promise<void> {
    await this.waitForVisible();
    await this.waitForLoading();

    const titles = await this.getListTitles();
    if (titles.length === 0) {
      throw new Error('Список Explorer пуст, нельзя проверить отсутствие пути в URL');
    }

    expect(await this.hasExplorerStateInUrl()).toBe(false);
  }

  async waitForUrlPathToSectionWithFirstItem(sectionTitle: string): Promise<void> {
    const sectionPath = explorerSectionPath[sectionTitle];
    if (!sectionPath) {
      throw new Error(`Неизвестный раздел Explorer: ${sectionTitle}`);
    }

    await this.waitForVisible();
    await this.waitForLoading();

    const firstItemId = await this.getFirstItemIdentifier();
    const expectedPrefix = [ExplorerItemType.ROOT, 'root', ...sectionPath];

    await browser.waitUntil(
      async () => {
        const actual = await this.getExplorerPathFromUrl();

        return (
          actual !== undefined &&
          actual.length === expectedPrefix.length + 2 &&
          expectedPrefix.every((item, index) => actual[index] === item) &&
          actual.at(-1) === firstItemId
        );
      },
      {
        timeoutMsg: `В URL не появился путь к разделу "${sectionTitle}" с первым элементом ${firstItemId}`
      }
    );
  }

  async waitForUrlLastPathItem(title: string): Promise<void> {
    const identifier = await this.getItemIdentifierByTitle(title);

    await browser.waitUntil(
      async () => {
        const path = await this.getExplorerPathFromUrl();

        return path?.at(-1) === identifier;
      },
      {
        timeoutMsg: `В URL последний пункт пути не соответствует элементу "${title}"`
      }
    );
  }

  buildStoryQueryForNonexistentItemInDataset(datasetTitle: string): Record<string, string> {
    const datasetId = explorerDatasetIdentifier[datasetTitle];
    if (!datasetId) {
      throw new Error(`Неизвестный набор данных Explorer: ${datasetTitle}`);
    }

    const sectionPath = explorerSectionPath['Наборы данных'];
    const path = [
      ExplorerItemType.ROOT,
      'root',
      ...sectionPath,
      ExplorerItemType.DATASET,
      datasetId,
      ExplorerItemType.TABLE,
      nonexistentTableId
    ];

    return {
      [`path_${EXPLORER_ROLE}`]: JSON.stringify(path),
      [`opts_${EXPLORER_ROLE}`]: JSON.stringify([0, 10, 'created_at', 'desc', {}])
    };
  }

  buildStoryQueryForSecondItemOnThirdPageOfDatasetsSection(): Record<string, string> {
    const datasetId = explorerDatasetIdentifier['Восток Крыма'];
    if (!datasetId) {
      throw new Error('Неизвестный набор данных Explorer: Восток Крыма');
    }

    const path = [
      ExplorerItemType.ROOT,
      'root',
      ...explorerSectionPath['Наборы данных'],
      ExplorerItemType.DATASET,
      datasetId
    ];

    return {
      [`path_${EXPLORER_ROLE}`]: JSON.stringify(path),
      [`opts_${EXPLORER_ROLE}`]: JSON.stringify([2, 5, 'created_at', 'asc', {}])
    };
  }

  buildStoryQueryForSecondItemOnWrongPageOfDatasetsSection(): Record<string, string> {
    const datasetId = explorerDatasetIdentifier['Восток Крыма'];
    if (!datasetId) {
      throw new Error('Неизвестный набор данных Explorer: Восток Крыма');
    }

    const path = [
      ExplorerItemType.ROOT,
      'root',
      ...explorerSectionPath['Наборы данных'],
      ExplorerItemType.DATASET,
      datasetId
    ];

    return {
      [`path_${EXPLORER_ROLE}`]: JSON.stringify(path),
      [`opts_${EXPLORER_ROLE}`]: JSON.stringify([1, 5, 'created_at', 'asc', {}])
    };
  }

  buildStoryQueryForSecondItemOnNonexistentPageOfDatasetsSection(): Record<string, string> {
    const datasetId = explorerDatasetIdentifier['Восток Крыма'];
    if (!datasetId) {
      throw new Error('Неизвестный набор данных Explorer: Восток Крыма');
    }

    const path = [
      ExplorerItemType.ROOT,
      'root',
      ...explorerSectionPath['Наборы данных'],
      ExplorerItemType.DATASET,
      datasetId
    ];

    return {
      [`path_${EXPLORER_ROLE}`]: JSON.stringify(path),
      [`opts_${EXPLORER_ROLE}`]: JSON.stringify([9999, 5, 'created_at', 'asc', {}])
    };
  }

  buildStoryQueryForDatasetsSectionWithTitleSortAndPageSize(): Record<string, string> {
    const datasetId = explorerDatasetIdentifier['Восток Крыма'];
    if (!datasetId) {
      throw new Error('Неизвестный набор данных Explorer: Восток Крыма');
    }

    const path = [
      ExplorerItemType.ROOT,
      'root',
      ...explorerSectionPath['Наборы данных'],
      ExplorerItemType.DATASET,
      datasetId
    ];

    return {
      [`path_${EXPLORER_ROLE}`]: JSON.stringify(path),
      [`opts_${EXPLORER_ROLE}`]: JSON.stringify([0, 5, 'title', 'asc', {}])
    };
  }

  buildStoryQueryForDatasetsItemWithFilterSortAndPageSize(): Record<string, string> {
    const datasetId = explorerDatasetIdentifier['Восток Крыма'];
    if (!datasetId) {
      throw new Error('Неизвестный набор данных Explorer: Восток Крыма');
    }

    const path = [
      ExplorerItemType.ROOT,
      'root',
      ...explorerSectionPath['Наборы данных'],
      ExplorerItemType.DATASET,
      datasetId
    ];

    return {
      [`path_${EXPLORER_ROLE}`]: JSON.stringify(path),
      [`opts_${EXPLORER_ROLE}`]: JSON.stringify([0, 5, 'title', 'desc', { title: 'Восток' }])
    };
  }

  async waitForCurrentPage(pageNumber: number): Promise<void> {
    await this.waitForVisible();
    await this.waitForLoading();

    await browser.waitUntil(
      async () => {
        try {
          const $selected = await this.findBySelector('paginationSelectedPage');
          const text = await $selected.getText();

          return text === String(pageNumber);
        } catch {
          return false;
        }
      },
      {
        timeoutMsg: `В explorer открыта не страница ${pageNumber}`
      }
    );
  }

  async waitForSelectedItem(title: string): Promise<void> {
    await browser.waitUntil(
      async () => {
        try {
          const $item = await this.getExplorerItemByTitle(title);
          const selectedByClass =
            (await hasClass($item, 'Explorer-Item_selected')) || (await hasClass($item, 'Mui-selected'));
          if (!selectedByClass) {
            return false;
          }

          const $infoTitle = await this.findBySelector('infoTitle');
          const infoTitle = await $infoTitle.getText();

          return infoTitle === title;
        } catch {
          return false;
        }
      },
      {
        timeoutMsg: `В explorer не выделен элемент "${title}"`
      }
    );
  }

  async waitForFilterValue(value: string): Promise<void> {
    await this.waitForVisible();
    await this.waitForLoading();

    await browser.waitUntil(
      async () => {
        try {
          const $filter = await this.findBySelector('filter');
          const input = new MuiInputBlock($filter);

          return (await input.getValue()) === value;
        } catch {
          return false;
        }
      },
      {
        timeoutMsg: `В explorer фильтр заполнен не значением "${value}"`
      }
    );
  }

  async waitForSortLabel(label: string): Promise<void> {
    await this.waitForVisible();
    await this.waitForLoading();

    await browser.waitUntil(
      async () => {
        try {
          const $sort = await this.findBySelector('sort');
          const select = new MuiSelectBlock($sort);

          return (await select.getText()) === label;
        } catch {
          return false;
        }
      },
      {
        timeoutMsg: `В explorer выбрана не сортировка "${label}"`
      }
    );
  }

  async waitForSortDirection(label: string): Promise<void> {
    await this.waitForVisible();
    await this.waitForLoading();

    await browser.waitUntil(
      async () => {
        try {
          const $button = await this.findBySelector('sortOrder');
          const ariaLabel = await $button.getAttribute('aria-label');

          return ariaLabel === label;
        } catch {
          return false;
        }
      },
      {
        timeoutMsg: `В explorer направление сортировки не "${label}"`
      }
    );
  }

  async waitForPageSize(pageSize: number): Promise<void> {
    await this.waitForVisible();
    await this.waitForLoading();

    await browser.waitUntil(
      async () => {
        try {
          const $pageSize = await this.findBySelector('pageSize');
          const select = new MuiSelectBlock($pageSize);

          return (await select.getText()) === String(pageSize);
        } catch {
          return false;
        }
      },
      {
        timeoutMsg: `В explorer размер страницы не ${pageSize}`
      }
    );
  }

  private async getExplorerPathFromUrl(): Promise<string[] | undefined> {
    const url = new URL(await browser.getUrl());
    const raw = url.searchParams.get(`path_${EXPLORER_ROLE}`);
    if (!raw) {
      return undefined;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isExplorerUrlPath(parsed)) {
      throw new Error(`Некорректный path_dm в URL: ${raw}`);
    }

    return parsed;
  }

  private async hasExplorerStateInUrl(): Promise<boolean> {
    const url = new URL(await browser.getUrl());

    return url.searchParams.has(`path_${EXPLORER_ROLE}`) || url.searchParams.has(`opts_${EXPLORER_ROLE}`);
  }

  private async getFirstItemIdentifier(): Promise<string> {
    const $firstItem = await this.findBySelector('firstItem');
    await $firstItem.waitForDisplayed();

    return $firstItem.$('.MuiListItemText-secondary').getText();
  }

  private async getItemIdentifierByTitle(title: string): Promise<string> {
    const $item = await this.getExplorerItemByTitle(title);

    return $item.$('.MuiListItemText-secondary').getText();
  }
}
