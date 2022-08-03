import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { IClassNameProps } from '@bem-react/core';
import { Card } from '@mui/material';
import { cn } from '@bem-react/classname';

import { ExplorerStore } from '../Explorer.store';
import { getDescription, getTitle } from '../Adapter/Explorer-Adapter';
import { ExplorerInfoContent } from '../InfoContent/Explorer-InfoContent';
import { ExplorerWidgets } from '../Widgets/Explorer-Widgets.composed';
import { ExplorerInfoTitle } from '../InfoTitle/Explorer-InfoTitle';
import { ExplorerActions } from '../Actions/Explorer-Actions';

import '!style-loader!css-loader!sass-loader!./Explorer-Info.scss';

export const cnExplorerInfo = cn('Explorer', 'Info');

export interface ExplorerInfoProps extends IClassNameProps {
  store: ExplorerStore;
}

export const ExplorerInfo: FC<ExplorerInfoProps> = observer(({ className, store }) => {
  const { selectedItem } = store;

  return (
    <Card className={cnExplorerInfo({}, [className])} elevation={3} square>
      <ExplorerInfoContent>
        <ExplorerInfoTitle>{getTitle(selectedItem)}</ExplorerInfoTitle>
        {getDescription(selectedItem)}
        <ExplorerWidgets item={selectedItem} type={selectedItem.type} />
      </ExplorerInfoContent>
      <ExplorerActions store={store} />
    </Card>
  );
});
