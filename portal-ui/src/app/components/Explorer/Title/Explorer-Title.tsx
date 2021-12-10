import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { Breadcrumbs } from '../../Breadcrumbs/Breadcrumbs';
import { BreadcrumbsItemData } from '../../Breadcrumbs/Item/Breadcrumbs-Item';

import { getTitle } from '../Adapter/Explorer-Adapter';
import { ExplorerItemData } from '../Explorer.models';
import { ExplorerStore } from '../Explorer.store';

import '!style-loader!css-loader!sass-loader!./Explorer-Title.scss';

const cnExplorerTitle = cn('Explorer', 'Title');

interface ExplorerTitleProps {
  store: ExplorerStore;
  onOpen: (item: ExplorerItemData, page: number, depth: number) => void;
}

interface ExplorerBreadcrumbItemData {
  item: ExplorerItemData;
  depth: number;
  onOpen: (item: ExplorerItemData, page: number, depth: number) => void;
}

const handleClick = ({ item, depth, onOpen }: ExplorerBreadcrumbItemData) => {
  onOpen(item, 0, depth);
};

export const ExplorerTitle: FC<ExplorerTitleProps> = observer(({ store, onOpen }) => {
  const items: BreadcrumbsItemData<ExplorerBreadcrumbItemData>[] = store.path.slice(0, -1).map((pathItem, i) => ({
    title: getTitle(pathItem),
    payload: {
      item: pathItem,
      depth: i,
      onOpen
    },
    onClick: handleClick
  }));

  return <Breadcrumbs className={cnExplorerTitle()} items={items} itemsType='button' />;
});
