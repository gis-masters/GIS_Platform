import React, { type FC } from 'react';
import { Search } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { IconButton } from '../../IconButton/IconButton';

const cnExplorerSearchSubmit = cn('Explorer', 'SearchSubmit');

export const ExplorerSearchSubmit: FC = () => (
  <IconButton className={cnExplorerSearchSubmit()} type='submit' size='small'>
    <Search />
  </IconButton>
);
