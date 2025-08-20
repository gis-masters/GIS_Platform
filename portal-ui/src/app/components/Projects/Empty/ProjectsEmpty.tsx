import React from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { currentProjectFolderStore } from '../../../stores/CurrentProjectFolder.store';
import { Link } from '../../Link/Link';

import '!style-loader!css-loader!sass-loader!./ProjectsEmpty.scss';

const cnProjectsEmpty = cn('ProjectsEmpty');

const buildUrlToProject = (folderId?: string | number | null): string => {
  if (!folderId) {
    return '/data-management';
  }

  return `/data-management?path_dm=["r","root","pr","projectsRoot","prf","${folderId}","none","none"]`;
};

export const ProjectsEmpty: React.FC = observer(() => {
  const folderId = currentProjectFolderStore.currentFolder?.id;

  return (
    <div className={cnProjectsEmpty()}>
      <p className={cnProjectsEmpty('Title')}>У вас ещё нет ни одного проекта</p>
      <p>
        <Link href={buildUrlToProject(folderId)}>Создайте первый проект</Link>, чтобы начать работу
      </p>
    </div>
  );
});
