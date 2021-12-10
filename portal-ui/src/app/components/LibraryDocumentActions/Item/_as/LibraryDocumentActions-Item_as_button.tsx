import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { Button } from '../../../Button/Button';

import { cnLibraryDocumentActionsItem, LibraryDocumentActionsItemProps } from '../LibraryDocumentActions-Item';

const LibraryDocumentActionsItemAsButton: FC<LibraryDocumentActionsItemProps> = ({
  title,
  icon,
  className,
  disabled,
  color,
  url,
  download,
  onClick
}) => (
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
