import React, { type FC, useCallback } from 'react';
import { observer } from 'mobx-react';

import { SortOrderButton } from '../../SortOrderButton/SortOrderButton';
import { type ProjectsStore } from '../Projects.store';

interface ProjectsSortOrderProps {
  store: ProjectsStore;
}

export const ProjectsSortOrder: FC<ProjectsSortOrderProps> = observer(({ store }) => {
  const handleClick = useCallback(() => {
    store.setSortAsc(!store.sortAsc);
  }, [store]);

  return <SortOrderButton asc={store.sortAsc} onClick={handleClick} />;
});
