import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { Edit, EditOutlined, SaveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { SimpleSchema } from '../../../services/data/schema/schema.models';
import { CrgProject } from '../../../services/gis/projects/projects.models';
import { projectsService } from '../../../services/gis/projects/projects.service';
import { ActionTypes, DataTypes } from '../../../services/permissions/permissions.models';
import { getAvailableActionsTooltipByRole } from '../../../services/permissions/permissions.utils';
import { getPatch } from '../../../services/util/patch';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { FormDialog } from '../../FormDialog/FormDialog';
import { TextBadge } from '../../TextBadge/TextBadge';

const cnProjectActionsEdit = cn('ProjectActions', 'Edit');
const cnProjectActionsEditDialog = cn('ProjectActions', 'EditDialog');

interface ProjectActionsProps {
  project: CrgProject;
  schema: SimpleSchema;
  as: ActionsItemVariant;
  disabled?: boolean;
  tooltipText?: string;
}

export const ProjectActionsEdit = observer((props: ProjectActionsProps) => {
  const { project, schema, disabled, as, tooltipText } = props;
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const role = project.role;

  if (!role) {
    return null;
  }

  const handleOpenDialog = useCallback(() => {
    setDialogOpen(true);
  }, [setDialogOpen]);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
  }, [setDialogOpen]);

  const updateDocumentPage = useCallback(
    async (value: CrgProject) => {
      await projectsService.update(project, getPatch(value, project));
    },
    [project]
  );

  return (
    <>
      <ActionsItem
        title={disabled && tooltipText ? tooltipText : 'Редактировать'}
        tooltipText={disabled ? getAvailableActionsTooltipByRole(ActionTypes.EDIT, role, DataTypes.PROJECT) : undefined}
        className={cnProjectActionsEdit()}
        icon={dialogOpen ? <Edit /> : <EditOutlined />}
        onClick={handleOpenDialog}
        as={as || 'button'}
        disabled={disabled}
      />

      <FormDialog<Partial<CrgProject>>
        open={dialogOpen}
        className={cnProjectActionsEditDialog()}
        schema={schema}
        value={project}
        actionFunction={updateDocumentPage}
        actionButtonProps={{ startIcon: <SaveOutlined />, children: 'Сохранить' }}
        onClose={handleCloseDialog}
        closeWithConfirm
        title={
          <>
            {project.folder ? 'Редактирование папки проекта' : 'Редактирование проекта'}
            <TextBadge id={project.id} />
          </>
        }
      />
    </>
  );
});
