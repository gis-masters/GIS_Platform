import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { LinearProgress } from '@material-ui/core';

import { currentMap } from '../../../stores/CurrentMap.store';
import { route } from '../../../stores/Route.store';
import { Pages } from '../../../app-routing.module';

import '!style-loader!css-loader!sass-loader!./WorkspaceHeader-Loader.scss';

const cnWorkspaceHeaderLoader = cn('WorkspaceHeader', 'Loader');

export const WorkspaceHeaderLoader: FC = observer(() => (
  <div className={cnWorkspaceHeaderLoader()}>
    {currentMap.isLoading && route.data.page === Pages.MAP && <LinearProgress />}
  </div>
));
