import React, { type FC } from 'react';
import { Menu as MenuIcon } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { IconButton } from '../../IconButton/IconButton';

import './WorkspaceHeader-Burger.scss';

const cnWorkspaceHeaderBurger = cn('WorkspaceHeader', 'Burger');

export interface WorkspaceHeaderBurgerProps {
  toggleOpen(e: React.MouseEvent<HTMLElement, MouseEvent>): void;
}

export const WorkspaceHeaderBurger: FC<WorkspaceHeaderBurgerProps> = ({ toggleOpen }) => (
  <IconButton className={cnWorkspaceHeaderBurger()} onClick={toggleOpen} color='inherit'>
    <MenuIcon fontSize='inherit' />
  </IconButton>
);
