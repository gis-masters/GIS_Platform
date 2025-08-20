import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { DriveFileMove, DriveFileMoveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { SimpleSchema } from '../../../services/data/schema/schema.models';
import { CrgProject } from '../../../services/gis/projects/projects.models';
import { projectsService } from '../../../services/gis/projects/projects.service';
import { ActionTypes, DataTypes, Role } from '../../../services/permissions/permissions.models';
import { getAvailableActionsTooltipByRole } from '../../../services/permissions/permissions.utils';
import { isAxiosError } from '../../../services/util/typeGuards/isAxiosError';
import { currentUser } from '../../../stores/CurrentUser.store';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { emptyItem, ExplorerItemData, ExplorerItemType } from '../../Explorer/Explorer.models';
import { Link } from '../../Link/Link';
import { projectsRootUrlItems } from '../../ProjectFolderContent/ProjectFolderContent.async';
import { SelectProjectFromExplorerDialog } from '../../SelectProjectFromExplorerDialog/SelectProjectFromExplorerDialog';
import { Toast } from '../../Toast/Toast';

const cnProjectActionsMove = cn('ProjectActions', 'Move');

interface ProjectActionsFilesPlacementProps {
  project: CrgProject;
  as: ActionsItemVariant;
  schema?: SimpleSchema;
  disabled?: boolean;
  tooltipText?: string;
  onChange?: (Project: CrgProject) => void;
}

export const ProjectActionsMove = observer((props: ProjectActionsFilesPlacementProps) => {
  const { as, project, disabled, onChange } = props;
  const [projectMoveDialogOpen, setProjectMoveDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const role = project.role;
  const { folder } = project;

  if (!role) {
    return null;
  }

  const successMessage = useCallback(
    (url?: string) => {
      Toast.success(
        <>
          {folder
            ? `Папка проекта "${project.name}" успешно перемещена. `
            : `Проект "${project.name}" успешно перемещен. `}
          {url && <Link href={url}>Перейти к {folder ? 'папке' : 'проекту'}</Link>}
        </>,
        { duration: 15_000 }
      );
    },
    [project, folder]
  );

  const handleOpenProjectMoveDialog = useCallback(() => {
    setProjectMoveDialogOpen(true);
  }, []);

  const handleCloseProjectMoveDialog = useCallback(() => {
    setProjectMoveDialogOpen(false);
  }, []);

  const handleSelectProject = useCallback(
    async (selectedProject: CrgProject | null) => {
      setLoading(true);

      try {
        if (!selectedProject?.id) {
          Toast.error({ message: 'Не удалось переместить. Выберите проект' });

          return;
        }

        if (onChange) {
          onChange(selectedProject);
        } else {
          await projectsService.move(project, selectedProject.id);

          const currentItem = folder ? ['prf', project.id] : ['project', project.id];
          const path = selectedProject?.path?.split('/') || ['', selectedProject.id];

          if (!path.length) {
            Toast.error({ message: 'Не удалось получить путь к папке' });

            return;
          }

          path.shift();

          const folders: (string | number)[] = [];

          for (const parentId of path) {
            folders.push('prf', parentId);
          }

          if (path.at(-1) !== selectedProject.id) {
            if (selectedProject.folder) {
              folders.push('prf', selectedProject.id);
            } else {
              folders.push('project', selectedProject.id);
            }
          }

          const pathWithCurrent = JSON.stringify([...projectsRootUrlItems, ...folders, ...currentItem]);

          successMessage(`/data-management?path_dm=${pathWithCurrent}`);
        }
      } catch (error) {
        if (isAxiosError<{ message?: string }>(error)) {
          Toast.error({
            message: error.response?.data?.message || error?.message
          });
        } else {
          Toast.error({ message: 'Не удалось переместить' });
        }
      } finally {
        setLoading(false);
        handleCloseProjectMoveDialog();
      }
    },
    [project, onChange, successMessage, handleCloseProjectMoveDialog]
  );

  const customTestForDisabled = useCallback(
    (item: ExplorerItemData) => {
      if (item.type === ExplorerItemType.PROJECT_FOLDER) {
        if (item.payload.id === project.id) {
          return true;
        }

        const isEditAllowed = currentUser.isAdmin || [Role.OWNER, Role.CONTRIBUTOR].includes(item.payload?.role);

        return !isEditAllowed;
      }
    },
    [project]
  );

  return (
    <>
      <ActionsItem
        title='Переместить'
        tooltipText={
          disabled ? getAvailableActionsTooltipByRole(ActionTypes.MOVE, role, DataTypes.PROJECT_FOLDER) : undefined
        }
        className={cnProjectActionsMove()}
        icon={projectMoveDialogOpen ? <DriveFileMove /> : <DriveFileMoveOutlined />}
        onClick={handleOpenProjectMoveDialog}
        as={as || 'button'}
        disabled={disabled}
      />

      <SelectProjectFromExplorerDialog
        project={project}
        title='Укажите папку для перемещения'
        startPath={[{ type: ExplorerItemType.PROJECTS_ROOT, payload: null }, emptyItem] as ExplorerItemData[]}
        open={projectMoveDialogOpen}
        loading={loading}
        onClose={handleCloseProjectMoveDialog}
        onSelect={handleSelectProject}
        customTestForDisabled={customTestForDisabled}
      />
    </>
  );
});
