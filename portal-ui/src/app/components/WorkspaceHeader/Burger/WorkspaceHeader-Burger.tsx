import React, { FC } from 'react';
import { IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./WorkspaceHeader-Burger.scss';

const cnWorkspaceHeaderBurger = cn('WorkspaceHeader', 'Burger');

export interface WorkspaceHeaderBurgerProps {
  toggleOpen(e: React.MouseEvent<HTMLElement, MouseEvent>): void;
}

export const WorkspaceHeaderBurger: FC<WorkspaceHeaderBurgerProps> = ({ toggleOpen }) => (
  <IconButton className={cnWorkspaceHeaderBurger()} onClick={toggleOpen} color='inherit'>
    <MenuIcon fontSize='inherit' />
  </IconButton>
);
