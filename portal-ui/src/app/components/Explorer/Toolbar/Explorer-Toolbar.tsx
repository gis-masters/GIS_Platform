import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ToolbarDivider } from '../../ToolbarDivider/ToolbarDivider';
import { ExplorerService } from '../Explorer.service';
import { ExplorerStore } from '../Explorer.store';
import { ExplorerFilter } from '../Filter/Explorer-Filter';
import { ExplorerPageSize } from '../PageSize/Explorer-PageSize';
import { ExplorerSearch } from '../Search/Explorer-Search';
import { ExplorerSort } from '../Sort/Explorer-Sort';
import { ExplorerToolbarActions } from '../ToolbarActions/Explorer-ToolbarActions';

import '!style-loader!css-loader!sass-loader!./Explorer-Toolbar.scss';

const cnExplorerToolbar = cn('Explorer', 'Toolbar');

interface ExplorerToolbarProps {
  store: ExplorerStore;
  service: ExplorerService;
  hideItemsSort?: boolean;
  hideToolbarActions?: boolean;
  hidePageSize?: boolean;
  onChange(): void;
  full: boolean;
}

export const ExplorerToolbar: FC<ExplorerToolbarProps> = ({
  store,
  service,
  hideItemsSort,
  hideToolbarActions,
  hidePageSize,
  onChange,
  full
}) => {
  return (
    <div className={cnExplorerToolbar()}>
      <ExplorerFilter store={store} onChange={onChange} service={service} />
      <ExplorerSearch store={store} onChange={onChange} service={service} />
      <ExplorerSort hideItemsSort={hideItemsSort} store={store} onChange={onChange} />
      <ExplorerPageSize hidePageSize={hidePageSize} store={store} onChange={onChange} />
      <ToolbarDivider />
      {!hideToolbarActions && <ExplorerToolbarActions service={service} store={store} full={full} />}
    </div>
  );
};
