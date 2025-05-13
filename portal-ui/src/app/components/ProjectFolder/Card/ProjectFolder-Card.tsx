import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Button } from '@mui/material';
import { cn } from '@bem-react/classname';

import { CrgProject } from '../../../services/gis/projects/projects.models';
import { ProjectFolderFooter } from '../Footer/ProjectFolder-Footer';
import { ProjectFolderName } from '../Name/ProjectFolder-Name';

import '!style-loader!css-loader!sass-loader!./ProjectFolder-Card.scss';

const cnProjectFolder = cn('ProjectFolder');

interface ProjectFolderCardProps {
  project: CrgProject;
  setOpenedFolder?: (id: number) => void;
}

export const ProjectFolderCard: FC<ProjectFolderCardProps> = observer(({ project, setOpenedFolder }) => {
  const openFolder = useCallback(() => {
    if (setOpenedFolder) {
      setOpenedFolder(project.id);
    }
  }, [setOpenedFolder, project]);

  return (
    <Button className={cnProjectFolder('Card')} onClick={openFolder}>
      <ProjectFolderName>{project.name}</ProjectFolderName>
      <ProjectFolderFooter />
    </Button>
  );
});
