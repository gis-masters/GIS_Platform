import React, { type FC, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import { MenuItem, TextField } from '@mui/material';
import { cn } from '@bem-react/classname';

import { type CrgProject } from '../../../services/gis/projects/projects.models';
import { type ProjectsStore } from '../Projects.store';

import './Projects-SortBy.scss';

const cnProjectsSortBy = cn('Projects', 'SortBy');

interface ProjectsSortByProps {
  store: ProjectsStore;
}

export const ProjectsSortBy: FC<ProjectsSortByProps> = observer(({ store }) => {
  useEffect(() => {
    return () => {
      store.setSortBy('createdAt');
    };
  }, [store]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      store.setSortBy(e.target.value as keyof CrgProject);
    },
    [store]
  );

  return (
    <TextField
      label='Сортировать по'
      variant='standard'
      value={store.sortBy}
      className={cnProjectsSortBy()}
      onChange={handleChange}
      select
    >
      <MenuItem value='createdAt'>По-умолчанию</MenuItem>
      <MenuItem value='name'>Названию</MenuItem>
    </TextField>
  );
});
