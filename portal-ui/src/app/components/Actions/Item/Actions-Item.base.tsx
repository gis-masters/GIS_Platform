import React, { FC, ReactNode } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { IconButtonProps } from '../../IconButton/IconButton';

export const cnActionsItem = cn('Actions', 'Item');

export type ActionsItemVariant = 'button' | 'iconButton' | 'menu';

export interface ActionsItemProps extends IClassNameProps {
  as: ActionsItemVariant;
  icon: ReactNode;
  title: string;
  disabled?: boolean;
  loading?: boolean;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  url?: string;
  download?: boolean;
  onClick?(): void;
  submenu?: ReactNode[];
  menuOpen?: boolean;
  size?: IconButtonProps['size'];
}

export const ActionsItemBase: FC<ActionsItemProps> = () => <></>;
