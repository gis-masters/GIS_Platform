import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Breadcrumbs } from '@material-ui/core';

import { ExplorerItemData } from '../Explorer.models';
import { ExplorerStore } from '../Explorer.store';
import { ExplorerTitleCrumb } from '../TitleCrumb/Explorer-TitleCrumb';

import '!style-loader!css-loader!sass-loader!./Explorer-Title.scss';

const cnExplorerTitle = cn('Explorer', 'Title');

interface ExplorerTitleProps {
  store: ExplorerStore;
  onOpen: (item: ExplorerItemData, page: number, depth: number) => void;
}

export const ExplorerTitle: FC<ExplorerTitleProps> = observer(({ store, onOpen }) => (
  <Breadcrumbs className={cnExplorerTitle()}>
    {store.path.slice(0, store.path.length - 1).map((pathItem, i) => (
      <ExplorerTitleCrumb store={store} depth={i} key={i} onOpen={onOpen} />
    ))}
  </Breadcrumbs>
));
