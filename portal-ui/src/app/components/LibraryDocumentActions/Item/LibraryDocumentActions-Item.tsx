import React, { FC, ReactNode } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

export const cnLibraryDocumentActionsItem = cn('LibraryDocumentActions', 'Item');

export type ActionsItemVariant = 'button' | 'iconButton' | 'menu';

export interface LibraryDocumentActionsItemProps extends IClassNameProps {
  as: ActionsItemVariant;
  icon: ReactNode;
  title: string;
  disabled?: boolean;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  url?: string;
  download?: boolean;
  onClick?(): void;
}

export const LibraryDocumentActionsItem: FC<LibraryDocumentActionsItemProps> = () => <></>;
