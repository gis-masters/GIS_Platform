import React, { FC, ReactNode } from 'react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { IconButton } from '../../IconButton/IconButton';

const cnCreateLibraryRecordItemSingleButton = cn('CreateLibraryRecord', 'ItemSingleButton');

export interface CreateLibraryRecordItemSingleButtonProps extends IClassNameProps {
  onClick(): void;
  icon: ReactNode;
  title: string;
}

export const CreateLibraryRecordItemSingleButton: FC<CreateLibraryRecordItemSingleButtonProps> = ({
  icon,
  title,
  className,
  onClick
}) => (
  <Tooltip title={`Создать: ${title}`}>
    <IconButton className={cnCreateLibraryRecordItemSingleButton(null, [className])} onClick={onClick}>
      {icon}
    </IconButton>
  </Tooltip>
);
