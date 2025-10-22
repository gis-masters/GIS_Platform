import React, { type FC } from 'react';
import { observer } from 'mobx-react';
import { LinearProgress } from '@mui/material';
import { cn } from '@bem-react/classname';

import { mapStore } from '../../../stores/Map.store';
import { Pages, route } from '../../../stores/Route.store';

import './WorkspaceHeader-Loader.scss';

const cnWorkspaceHeaderLoader = cn('WorkspaceHeader', 'Loader');

export const WorkspaceHeaderLoader: FC = observer(() => (
  <div className={cnWorkspaceHeaderLoader()}>
    {mapStore.isLoading && route.data.page === Pages.MAP && <LinearProgress />}
  </div>
));
