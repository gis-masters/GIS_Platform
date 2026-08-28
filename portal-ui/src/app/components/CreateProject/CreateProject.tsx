import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { CreateNewFolderOutlined, PlaylistAdd } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import {
  type CrgProject,
  crgProjectFolderSchema,
  crgProjectSchema,
  type NewCrgProject
} from '../../services/gis/projects/projects.models';
import { projectsService } from '../../services/gis/projects/projects.service';
import { FormDialog } from '../FormDialog/FormDialog';
import { IconButton } from '../IconButton/IconButton';

const cnCreateProject = cn('CreateProject');

interface CreateProjectProps {
  folder?: boolean;
  currentProjectFolderId?: number;
}

export const CreateProject = observer(({ folder, currentProjectFolderId }: CreateProjectProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const create = useCallback(
    async (project: NewCrgProject) => {
      if (folder) {
        project.folder = true;
      }

      if (currentProjectFolderId && !project.parentId) {
        project.parentId = currentProjectFolderId;
      }

      await projectsService.create(project);
    },
    [currentProjectFolderId, folder]
  );

  return (
    <>
      <Tooltip title={folder ? 'Создать папку проектов' : 'Создать проект'}>
        <span>
          <IconButton className={cnCreateProject({ mode: folder ? 'folder' : 'project' })} onClick={openDialog}>
            {folder ? <CreateNewFolderOutlined /> : <PlaylistAdd />}
          </IconButton>
        </span>
      </Tooltip>

      <FormDialog<CrgProject>
        title={folder ? 'Создание папки проектов' : 'Создание нового проекта'}
        className={cnCreateProject('Dialog')}
        open={dialogOpen}
        schema={folder ? crgProjectFolderSchema : crgProjectSchema}
        onClose={closeDialog}
        closeWithConfirm
        actionFunction={create}
        actionButtonProps={{ children: 'Создать' }}
      />
    </>
  );
});
