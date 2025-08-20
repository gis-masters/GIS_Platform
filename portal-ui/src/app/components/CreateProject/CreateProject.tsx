import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { CreateNewFolderOutlined, PlaylistAdd } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { CrgProject, NewCrgProject } from '../../services/gis/projects/projects.models';
import { projectsService } from '../../services/gis/projects/projects.service';
import { FormDialog } from '../FormDialog/FormDialog';
import { IconButton } from '../IconButton/IconButton';
import { crgProjectFolderSchema, crgProjectSchema } from '../ProjectActions/ProjectActions';

const cnCreateProject = cn('CreateProject');
const cnCreateProjectFolder = cn('CreateProjectFolder');

interface CreateProjectProps {
  isFolder?: boolean;
  currentProjectFolderId?: number;
  onCreate(project: CrgProject): void;
}

export const CreateProject = observer(({ isFolder, currentProjectFolderId, onCreate }: CreateProjectProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const create = useCallback(
    async (project: NewCrgProject) => {
      if (isFolder) {
        project.folder = true;
      }

      if (currentProjectFolderId && !project.parentId) {
        project.parentId = currentProjectFolderId;
      }

      const newProject = await projectsService.create(project);

      onCreate(newProject);
    },
    [currentProjectFolderId, isFolder, onCreate]
  );

  return (
    <>
      <Tooltip title={isFolder ? 'Создать папку проектов' : 'Создать проект'}>
        <span>
          <IconButton className={isFolder ? cnCreateProjectFolder() : cnCreateProject()} onClick={openDialog}>
            {isFolder ? <CreateNewFolderOutlined /> : <PlaylistAdd />}
          </IconButton>
        </span>
      </Tooltip>

      <FormDialog<CrgProject>
        title={isFolder ? 'Создание папки проектов' : 'Создание нового проекта'}
        className={isFolder ? cnCreateProjectFolder('Dialog') : cnCreateProject('Dialog')}
        open={dialogOpen}
        value={{}}
        schema={isFolder ? crgProjectFolderSchema : crgProjectSchema}
        onClose={closeDialog}
        closeWithConfirm
        actionFunction={create}
        actionButtonProps={{ children: 'Создать' }}
      />
    </>
  );
});
