import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';
import { Tooltip } from '@mui/material';

import { MenuIconButton } from '../../../MenuIconButton/MenuIconButton';
import { IconButton } from '../../../IconButton/IconButton';

import { cnActionsItem, ActionsItemProps } from '../Actions-Item.base';

const ActionsItemAsIconButton: FC<ActionsItemProps> = ({
  title,
  className,
  disabled,
  color,
  url,
  icon,
  download,
  onClick,
  submenu,
  loading
}) => (
  <Tooltip title={title} enterDelay={600}>
    {submenu ? (
      <MenuIconButton icon={icon}>{submenu}</MenuIconButton>
    ) : (
      <IconButton
        className={cnActionsItem(null, [className])}
        disabled={disabled}
        onClick={onClick}
        color={color}
        href={url}
        download={download}
        loading={loading}
      >
        {icon}
      </IconButton>
    )}
  </Tooltip>
);

export const asIconButton = withBemMod<ActionsItemProps, ActionsItemProps>(
  cnActionsItem(),
  { as: 'iconButton' },
  () => ActionsItemAsIconButton
);
