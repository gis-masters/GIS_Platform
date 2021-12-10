import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';
import { IconButton, Tooltip } from '@mui/material';

import { Link } from '../../../Link/Link';

import { cnLibraryDocumentActionsItem, LibraryDocumentActionsItemProps } from '../LibraryDocumentActions-Item';

const LibraryDocumentActionsItemAsIconButton: FC<LibraryDocumentActionsItemProps> = ({
  title,
  className,
  disabled,
  color,
  url,
  icon,
  download,
  onClick
}) => (
  <Tooltip title={title}>
    <span>
      <Link href={url} theme='contents' disabled={!url || Boolean(onClick)} download={download}>
        <IconButton
          className={cnLibraryDocumentActionsItem(null, [className])}
          disabled={disabled}
          onClick={onClick}
          color={color}
        >
          {icon}
        </IconButton>
      </Link>
    </span>
  </Tooltip>
);

export const asIconButton = withBemMod<LibraryDocumentActionsItemProps, LibraryDocumentActionsItemProps>(
  cnLibraryDocumentActionsItem(),
  { as: 'iconButton' },
  () => LibraryDocumentActionsItemAsIconButton
);
