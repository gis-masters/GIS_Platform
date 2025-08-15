import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Card } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ExplorerActions } from '../Actions/Explorer-Actions';
import { getDescription, getTitle } from '../Adapter/Explorer-Adapter';
import { ExplorerItemType } from '../Explorer.models';
import { ExplorerStore } from '../Explorer.store';
import { ExplorerInfoContent } from '../InfoContent/Explorer-InfoContent';
import { ExplorerInfoTitle } from '../InfoTitle/Explorer-InfoTitle';
import { ExplorerWidgets } from '../Widgets/Explorer-Widgets.composed';

import '!style-loader!css-loader!sass-loader!./Explorer-Info.scss';

export const cnExplorerInfo = cn('Explorer', 'Info');
export const cnExplorerWidgets = cn('Explorer', 'Widgets');

export interface ExplorerInfoProps extends IClassNameProps {
  store: ExplorerStore;
}

export const ExplorerInfo: FC<ExplorerInfoProps> = observer(({ className, store }) => {
  const { selectedItem } = store;

  return (
    <Card
      className={cnExplorerInfo({ empty: selectedItem.type === ExplorerItemType.NONE }, [className])}
      elevation={3}
      square
    >
      <ExplorerInfoContent>
        <ExplorerInfoTitle>{getTitle(selectedItem, store)}</ExplorerInfoTitle>
        {getDescription(selectedItem, store)}
        <ExplorerWidgets className={cnExplorerWidgets()} store={store} item={selectedItem} type={selectedItem.type} />
      </ExplorerInfoContent>
      <ExplorerActions store={store} />
    </Card>
  );
});
