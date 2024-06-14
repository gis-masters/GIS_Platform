import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { isRecordStringUnknown } from '../../../services/util/typeGuards/isRecordStringUnknown';
import { Breadcrumbs, BreadcrumbsItemData } from '../../Breadcrumbs/Breadcrumbs';
import { BreadcrumbsItemsType } from '../../Breadcrumbs/Item/Breadcrumbs-Item.base';
import { getTitle } from '../Adapter/Explorer-Adapter';
import { ExplorerItemData, ExplorerItemType, ExplorerSearchValue } from '../Explorer.models';
import { ExplorerStore } from '../Explorer.store';

import '!style-loader!css-loader!sass-loader!./Explorer-Breadcrumb.scss';

const cnExplorerBreadcrumb = cn('Explorer', 'Breadcrumbs');

interface ExplorerBreadcrumbsProps {
  store: ExplorerStore;
  onOpen(item: ExplorerItemData, depth: number): void;
}

interface ExplorerBreadcrumbItemData {
  item: ExplorerItemData;
  depth: number;
  onOpen(item: ExplorerItemData, depth: number): void;
}

function isExplorerBreadcrumbItemData(item: unknown): item is ExplorerBreadcrumbItemData {
  if (!isRecordStringUnknown(item)) {
    return false;
  }

  if (typeof item.item !== 'object') {
    return false;
  }

  if (typeof item.depth !== 'number') {
    return false;
  }

  return !(typeof item.onOpen !== 'function');
}

const handleClick = (itemData: unknown) => {
  if (!isExplorerBreadcrumbItemData(itemData)) {
    throw new Error('Ошибка данных для ExplorerBreadcrumb');
  }

  itemData.onOpen(itemData.item, itemData.depth);
};

export const ExplorerBreadcrumb: FC<ExplorerBreadcrumbsProps> = observer(({ store, onOpen }) => {
  let items: BreadcrumbsItemData[] = store.path.slice(0, -1).map((pathItem, i) => ({
    title: getTitle(pathItem, store),
    payload: {
      item: pathItem,
      depth: i,
      onOpen
    },
    onClick: handleClick
  }));

  let itemsType: BreadcrumbsItemsType = 'button';
  const srr = store.path?.find(item => item.type === ExplorerItemType.SEARCH_RESULT_ROOT);
  if (srr) {
    const search = srr.payload as ExplorerSearchValue;

    items =
      search.path?.map((pathItem, i) => ({
        title: getTitle(pathItem, store),
        payload: {
          item: pathItem,
          depth: i,
          onOpen
        },
        onClick: handleClick
      })) || [];

    items.push({ title: `Поиск: ${search.breadcrumbSearchValue}` });
    itemsType = 'none';
  }

  return <Breadcrumbs className={cnExplorerBreadcrumb()} items={items} itemsType={itemsType} />;
});
