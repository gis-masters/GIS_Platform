import React, { FC } from 'react';
import { Tooltip } from '@mui/material';
import { withBemMod } from '@bem-react/core';

import { IconButton } from '../../../IconButton/IconButton';
import { MenuIconButton } from '../../../MenuIconButton/MenuIconButton';
import { ActionsItemProps, cnActionsItem } from '../Actions-Item.base';

const ActionsItemAsIconButton: FC<ActionsItemProps> = ({
  title,
  tooltipText,
  className,
  disabled,
  color,
  url,
  icon,
  download,
  onClick,
  submenu,
  loading,
  size
}) => (
  <Tooltip title={tooltipText || title} enterDelay={600}>
    {submenu ? (
      <span>
        <MenuIconButton className={className} icon={icon}>
          {submenu}
        </MenuIconButton>
      </span>
    ) : (
      <span>
        <IconButton
          className={cnActionsItem(null, [className])}
          disabled={disabled}
          onClick={onClick}
          color={color}
          href={url}
          download={download}
          loading={loading}
          size={size}
        >
          {icon}
        </IconButton>
      </span>
    )}
  </Tooltip>
);

export const asIconButton = withBemMod<ActionsItemProps, ActionsItemProps>(
  cnActionsItem(),
  { as: 'iconButton' },
  () => ActionsItemAsIconButton
);
