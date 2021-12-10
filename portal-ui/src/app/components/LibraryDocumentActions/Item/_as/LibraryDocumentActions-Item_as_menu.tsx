import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';

import { cnLibraryDocumentActionsItem, LibraryDocumentActionsItemProps } from '../LibraryDocumentActions-Item';
import { Link } from '../../../Link/Link';

const LibraryDocumentActionsItemAsMenu: FC<LibraryDocumentActionsItemProps> = ({
  title,
  className,
  disabled,
  icon,
  url,
  download,
  onClick
}) => (
  <Link href={url} theme='contents' disabled={!url || Boolean(onClick)} download={download}>
    <MenuItem className={cnLibraryDocumentActionsItem(null, [className])} disabled={disabled} onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{title}</ListItemText>
    </MenuItem>
  </Link>
);

export const asMenu = withBemMod<LibraryDocumentActionsItemProps, LibraryDocumentActionsItemProps>(
  cnLibraryDocumentActionsItem(),
  { as: 'menu' },
  () => LibraryDocumentActionsItemAsMenu
);
