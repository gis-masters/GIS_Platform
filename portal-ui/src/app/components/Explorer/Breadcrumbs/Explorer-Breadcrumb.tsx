import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { BreadcrumbsItemsType } from '../../Breadcrumbs/Item/Breadcrumbs-Item.base';
import { Breadcrumbs, BreadcrumbsItemData } from '../../Breadcrumbs/Breadcrumbs';

import { ExplorerItemData, ExplorerItemType, ExplorerSearchValue } from '../Explorer.models';
import { getTitle } from '../Adapter/Explorer-Adapter';
import { ExplorerStore } from '../Explorer.store';

import '!style-loader!css-loader!sass-loader!./Explorer-Breadcrumb.scss';

const cnExplorerBreadcrumb = cn('Explorer', 'Breadcrumbs');

interface ExplorerBreadcrumbsProps {
  store: ExplorerStore;
  onOpen: (item: ExplorerItemData, depth: number) => void;
}

interface ExplorerBreadcrumbItemData {
  item: ExplorerItemData;
  depth: number;
  onOpen: (item: ExplorerItemData, depth: number) => void;
}

const handleClick = ({ item, depth, onOpen }: ExplorerBreadcrumbItemData) => {
  onOpen(item, depth);
};

export const ExplorerBreadcrumb: FC<ExplorerBreadcrumbsProps> = observer(({ store, onOpen }) => {
  let items: BreadcrumbsItemData<ExplorerBreadcrumbItemData>[] = [];

  items = store.path.slice(0, -1).map((pathItem, i) => ({
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
