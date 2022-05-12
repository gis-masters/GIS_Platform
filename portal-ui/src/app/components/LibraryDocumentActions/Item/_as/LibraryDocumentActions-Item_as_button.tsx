import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { Button } from '../../../Button/Button';

import { cnLibraryDocumentActionsItem, LibraryDocumentActionsItemProps } from '../LibraryDocumentActions-Item';
import { MenuButton } from '../../../MenuButton/MenuButton';

const LibraryDocumentActionsItemAsButton: FC<LibraryDocumentActionsItemProps> = ({
  title,
  icon,
  className,
  disabled,
  color,
  url,
  download,
  submenu,
  loading,
  onClick
}) =>
  submenu ? (
    <MenuButton
      className={cnLibraryDocumentActionsItem(null, [className])}
      href={download ? url : undefined}
      routerLink={!download ? url : undefined}
      onClick={onClick}
      color={color || 'inherit'}
      startIcon={icon}
      disabled={disabled}
      loading={loading}
      menu={submenu}
    >
      {title}
    </MenuButton>
  ) : (
    <Button
      className={cnLibraryDocumentActionsItem(null, [className])}
      href={download ? url : undefined}
      routerLink={!download ? url : undefined}
      disabled={disabled}
      onClick={onClick}
      color={color || 'inherit'}
      startIcon={icon}
    >
      {title}
    </Button>
  );

export const asButton = withBemMod<LibraryDocumentActionsItemProps, LibraryDocumentActionsItemProps>(
  cnLibraryDocumentActionsItem(),
  { as: 'button' },
  () => LibraryDocumentActionsItemAsButton
);
