import React, { createContext, FC } from 'react';
import { observer } from 'mobx-react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import { withBemMod } from '@bem-react/core';

import { MenuNestedItem } from '../../../MenuNestedItem/MenuNestedItem';
import { Link } from '../../../Link/Link';

import { cnLibraryDocumentActionsItem, LibraryDocumentActionsItemProps } from '../LibraryDocumentActions-Item';

export const LibraryDocumentActionsMenuOpenContext = createContext<boolean>(false);

const LibraryDocumentActionsItemAsMenu: FC<LibraryDocumentActionsItemProps> = observer(
  ({ title, className, disabled, icon, url, download, onClick, submenu }) =>
    submenu ? (
      <LibraryDocumentActionsMenuOpenContext.Consumer>
        {parentMenuOpen => (
          <MenuNestedItem
            className={cnLibraryDocumentActionsItem(null, [className])}
            parentMenuOpen={parentMenuOpen}
            submenu={submenu}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{title}</ListItemText>
            <ChevronRight color='action' />
          </MenuNestedItem>
        )}
      </LibraryDocumentActionsMenuOpenContext.Consumer>
    ) : (
      <Link href={url} variant='contents' disabled={!url || Boolean(onClick)} download={download}>
        <MenuItem className={cnLibraryDocumentActionsItem(null, [className])} disabled={disabled} onClick={onClick}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText>{title}</ListItemText>
        </MenuItem>
      </Link>
    )
);

export const asMenu = withBemMod<LibraryDocumentActionsItemProps, LibraryDocumentActionsItemProps>(
  cnLibraryDocumentActionsItem(),
  { as: 'menu' },
  () => LibraryDocumentActionsItemAsMenu
);
