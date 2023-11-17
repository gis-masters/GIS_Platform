import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ToolbarDivider } from '../../ToolbarDivider/ToolbarDivider';

import { ExplorerStore } from '../Explorer.store';
import { ExplorerToolbarActions } from '../ToolbarActions/Explorer-ToolbarActions';
import { ExplorerPageSize } from '../PageSize/Explorer-PageSize';
import { ExplorerSearch } from '../Search/Explorer-Search';
import { ExplorerFilter } from '../Filter/Explorer-Filter';
import { ExplorerService } from '../Explorer.service';
import { ExplorerSort } from '../Sort/Explorer-Sort';

import '!style-loader!css-loader!sass-loader!./Explorer-Toolbar.scss';

const cnExplorerToolbar = cn('Explorer', 'Toolbar');

interface ExplorerToolbarProps {
  store: ExplorerStore;
  service: ExplorerService;
  onChange: () => void;
  full: boolean;
}

export const ExplorerToolbar: FC<ExplorerToolbarProps> = ({ store, service, onChange, full }) => {
  return (
    <div className={cnExplorerToolbar()}>
      <ExplorerFilter store={store} onChange={onChange} service={service} />
      <ExplorerSearch store={store} onChange={onChange} service={service} />
      <ExplorerSort store={store} onChange={onChange} />
      <ExplorerPageSize store={store} onChange={onChange} />
      <ToolbarDivider />
      <ExplorerToolbarActions service={service} store={store} full={full} />
    </div>
  );
};
