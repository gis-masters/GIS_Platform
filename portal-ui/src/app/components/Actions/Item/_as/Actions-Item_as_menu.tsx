import React, { createContext, FC } from 'react';
import { observer } from 'mobx-react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { withBemMod } from '@bem-react/core';

import { Link } from '../../../Link/Link';
import { MenuNestedItem } from '../../../MenuNestedItem/MenuNestedItem';
import { ActionsItemProps, cnActionsItem } from '../Actions-Item.base';

export const ActionsMenuOpenContext = createContext<boolean>(false);

const ActionsItemAsMenu: FC<ActionsItemProps> = observer(
  ({ title, className, disabled, icon, url, download, onClick, submenu }) =>
    submenu ? (
      <ActionsMenuOpenContext.Consumer>
        {parentMenuOpen => (
          <MenuNestedItem
            className={cnActionsItem(null, [className])}
            parentMenuOpen={parentMenuOpen}
            submenu={submenu}
            icon={icon}
            title={title}
          />
        )}
      </ActionsMenuOpenContext.Consumer>
    ) : (
      <Link href={url || ''} variant='contents' disabled={!url || Boolean(onClick)} download={download}>
        <MenuItem className={cnActionsItem(null, [className])} disabled={disabled} onClick={onClick}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText>{title}</ListItemText>
        </MenuItem>
      </Link>
    )
);

export const asMenu = withBemMod<ActionsItemProps, ActionsItemProps>(
  cnActionsItem(),
  { as: 'menu' },
  () => ActionsItemAsMenu
);
