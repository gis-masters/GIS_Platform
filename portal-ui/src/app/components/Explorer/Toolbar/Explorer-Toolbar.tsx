import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ExplorerStore } from '../Explorer.store';
import { ExplorerToolbarActions } from '../ToolbarActions/Explorer-ToolbarActions';
import { ExplorerToolbarDivider } from '../ToolbarDivider/Explorer-ToolbarDivider';
import { ExplorerPageSize } from '../PageSize/Explorer-PageSize';
import { ExplorerFilter } from '../Filter/Explorer-Filter';
import { ExplorerSort } from '../Sort/Explorer-Sort';

import '!style-loader!css-loader!sass-loader!./Explorer-Toolbar.scss';

const cnExplorerToolbar = cn('Explorer', 'Toolbar');

interface ExplorerToolbarProps {
  store: ExplorerStore;
  onChange: () => void;
}

export const ExplorerToolbar: FC<ExplorerToolbarProps> = ({ store, onChange }) => {
  return (
    <div className={cnExplorerToolbar()}>
      <ExplorerFilter store={store} onChange={onChange} />
      <ExplorerSort store={store} onChange={onChange} />
      <ExplorerPageSize store={store} onChange={onChange} />
      <ExplorerToolbarDivider />
      <ExplorerToolbarActions store={store} />
    </div>
  );
};
