import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';
import { Tooltip } from '@mui/material';

import { MenuIconButton } from '../../../MenuIconButton/MenuIconButton';
import { IconButton } from '../../../IconButton/IconButton';

import { cnLibraryDocumentActionsItem, LibraryDocumentActionsItemProps } from '../LibraryDocumentActions-Item';

const LibraryDocumentActionsItemAsIconButton: FC<LibraryDocumentActionsItemProps> = ({
  title,
  className,
  disabled,
  color,
  url,
  icon,
  download,
  onClick,
  submenu
}) => (
  <Tooltip title={title} enterDelay={600}>
    {submenu ? (
      <MenuIconButton icon={icon}>{submenu}</MenuIconButton>
    ) : (
      <IconButton
        className={cnLibraryDocumentActionsItem(null, [className])}
        disabled={disabled}
        onClick={onClick}
        color={color}
        href={url}
        download={download}
      >
        {icon}
      </IconButton>
    )}
  </Tooltip>
);

export const asIconButton = withBemMod<LibraryDocumentActionsItemProps, LibraryDocumentActionsItemProps>(
  cnLibraryDocumentActionsItem(),
  { as: 'iconButton' },
  () => LibraryDocumentActionsItemAsIconButton
);
