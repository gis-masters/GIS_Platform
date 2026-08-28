import { isEqual } from 'lodash';

import { registryDefaultFilter } from '../../../../src/app/components/DataManagement/DataManagement.utils';
import { SortOrder } from '../../../../src/app/services/models';
import { getFieldFilterValue } from '../../../../src/app/services/util/filters/filters';
import { type FilterQuery } from '../../../../src/app/services/util/filters/filters.models';
import { isArray } from '../../../../src/app/services/util/typeGuards/isArray';
import { isRecordStringUnknown } from '../../../../src/app/services/util/typeGuards/isRecordStringUnknown';
import { Block } from '../../classes/Block';
import { xTableBlock } from '../XTable/XTable.block';

const TITLE_FIELD = 'title';
const jsonPercentEscape = String.fromCodePoint(92, 117, 48, 48, 50, 53);

function isRegistryUrlSort(value: unknown): value is [string, string] {
  return isArray(value) && value.length === 2 && typeof value[0] === 'string' && typeof value[1] === 'string';
}

class RegistryBlock extends Block {
  selectors = {
    root: '.LibraryRegistry',
    loader: '.LibraryRegistry .Loading'
  };

  buildStoryQueryForTitleFilterAndDescSort(titleFilter: string): Record<string, string> {
    return {
      sort: JSON.stringify([TITLE_FIELD, SortOrder.DESC]),
      // % в JSON query иначе читается как percent-encoding (%12), поэтому % в ilike кодируем как \u0025
      filter: JSON.stringify({
        $and: [registryDefaultFilter, { [TITLE_FIELD]: { $ilike: `%${titleFilter}%` } }]
      }).replaceAll('%', jsonPercentEscape)
    };
  }

  async waitForUrlSort(field: string, order: SortOrder): Promise<void> {
    await this.waitForVisible();

    await browser.waitUntil(
      async () => {
        try {
          const sort = await this.getSortFromUrl();

          return sort?.[0] === field && sort?.[1] === order;
        } catch {
          return false;
        }
      },
      {
        timeoutMsg: `В URL нет сортировки по полю ${field} в порядке ${order}`
      }
    );
  }

  async waitForUrlIsFolderFilter(): Promise<void> {
    await this.waitForVisible();

    await browser.waitUntil(
      async () => {
        try {
          const filter = await this.getFilterFromUrl();
          if (!filter) {
            return false;
          }

          return isEqual(getFieldFilterValue(filter, 'is_folder'), registryDefaultFilter.is_folder);
        } catch {
          return false;
        }
      },
      {
        timeoutMsg: 'В URL нет фильтра is_folder'
      }
    );
  }

  async waitForUrlTitleIlike(value: string): Promise<void> {
    await this.waitForVisible();

    await browser.waitUntil(
      async () => {
        try {
          const filter = await this.getFilterFromUrl();
          if (!filter) {
            return false;
          }

          return this.hasTitleIlike(filter, value);
        } catch {
          return false;
        }
      },
      {
        timeoutMsg: `В URL нет строкового фильтра title со значением ${value}`
      }
    );
  }

  async waitForColumnSortDirection(title: string, direction: SortOrder): Promise<void> {
    await this.waitForVisible();
    await xTableBlock.waitForLoading();

    await browser.waitUntil(
      async () => {
        try {
          return (await xTableBlock.getColumnSortDirection(title)) === direction;
        } catch {
          return false;
        }
      },
      {
        timeoutMsg: `Колонка "${title}" не отсортирована в порядке ${direction}`
      }
    );
  }

  async waitForPageSize(pageSize: number): Promise<void> {
    await this.waitForVisible();
    await xTableBlock.waitForLoading();

    await browser.waitUntil(
      async () => {
        try {
          return (await xTableBlock.getPageSize()) === String(pageSize);
        } catch {
          return false;
        }
      },
      {
        timeoutMsg: `В реестре размер страницы не ${pageSize}`
      }
    );
  }

  private hasTitleIlike(filter: FilterQuery, value: string): boolean {
    const fieldValue = getFieldFilterValue(filter, TITLE_FIELD);
    if (!isRecordStringUnknown(fieldValue) || typeof fieldValue.$ilike !== 'string') {
      return false;
    }

    return fieldValue.$ilike.includes(value);
  }

  private async getSortFromUrl(): Promise<[string, string] | undefined> {
    const url = new URL(await browser.getUrl());
    const raw = url.searchParams.get('sort');
    if (!raw) {
      return undefined;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isRegistryUrlSort(parsed)) {
      throw new Error(`Некорректный sort в URL: ${raw}`);
    }

    return parsed;
  }

  private async getFilterFromUrl(): Promise<FilterQuery | undefined> {
    const url = new URL(await browser.getUrl());
    const raw = url.searchParams.get('filter');
    if (!raw) {
      return undefined;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isRecordStringUnknown(parsed)) {
      throw new Error(`Некорректный filter в URL: ${raw}`);
    }

    return parsed as FilterQuery;
  }
}

export const registryBlock = new RegistryBlock();
