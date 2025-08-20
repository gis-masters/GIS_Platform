import React, { FC, useCallback } from 'react';
import { ShareOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { CrgProject } from '../../../services/gis/projects/projects.models';
import { copyToClipboard } from '../../../services/util/clipboard.util';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { Toast } from '../../Toast/Toast';

const cnProjectActionsShare = cn('ProjectActions', 'Share');

interface ProjectActionsShareProps {
  project: CrgProject;
  as: ActionsItemVariant;
}

export const ProjectActionsShare: FC<ProjectActionsShareProps> = ({ project, as }) => {
  const handleClick = useCallback(() => {
    copyToClipboard(
      project.folder
        ? `${location.protocol}//${location.host}/data-management/projectFolder/${project.id}`
        : `${location.protocol}//${location.host}/projects/${project.id}/map`
    );

    Toast.success('Сохранено в буфер обмена');
  }, [project]);

  return (
    <ActionsItem
      className={cnProjectActionsShare()}
      title='Копировать ссылку'
      icon={<ShareOutlined />}
      onClick={handleClick}
      as={as}
    />
  );
};
