import React, { type ChangeEvent, type FC, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { cn } from '@bem-react/classname';

import { type ProjectsStore } from '../Projects.store';

import './Projects-Filter.scss';

const cnProjectsFilter = cn('Projects', 'Filter');

interface ProjectsFilterProps {
  store: ProjectsStore;
}

export const ProjectsFilter: FC<ProjectsFilterProps> = observer(({ store }) => {
  useEffect(() => {
    return () => {
      store.setNameFilter('');
    };
  }, [store]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      store.setNameFilter(e.target.value);
    },
    [store]
  );

  return (
    <TextField
      label='Фильтр по названию'
      variant='standard'
      value={store.nameFilter}
      className={cnProjectsFilter()}
      onChange={handleChange}
      InputProps={{
        startAdornment: ' '
      }}
    />
  );
});
