import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Search } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { IconButton } from '../../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./SearchInProject-Toggler.scss';

const cnSearchInProjectToggler = cn('SearchInProject', 'Toggler');

interface SearchInProjectTogglerProps {
  expanded: boolean;
  onClick(): void;
}

export const SearchInProjectToggler: FC<SearchInProjectTogglerProps> = observer(({ expanded, onClick }) => (
  <IconButton
    className={cnSearchInProjectToggler({ expanded })}
    type='submit'
    size='small'
    color='inherit'
    onClick={onClick}
  >
    <Search />
  </IconButton>
));
