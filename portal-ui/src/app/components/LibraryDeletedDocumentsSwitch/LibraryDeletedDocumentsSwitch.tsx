import React, { FC } from 'react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { getRegistryUrlWithPath } from '../DataManagement/DataManagement.utils';
import { Library } from '../../services/data/library/library.models';
import { DeletedDocuments } from '../Icons/DeletedDocuments';
import { IconButton } from '../IconButton/IconButton';

const cnLibraryDeletedDocumentsSwitch = cn('LibraryDeletedDocumentsSwitch');

interface LibraryDeletedDocumentsSwitchProps {
  library: Library;
}

export const LibraryDeletedDocumentsSwitch: FC<LibraryDeletedDocumentsSwitchProps> = ({ library }) => {
  const href = getRegistryUrlWithPath(library.table_name, [], { is_deleted: true });

  return (
    <Tooltip title={'Перейти в корзину удалённых документов'}>
      <IconButton className={cnLibraryDeletedDocumentsSwitch()} href={href}>
        <DeletedDocuments fontSize='medium' color='inherit' />
      </IconButton>
    </Tooltip>
  );
};
