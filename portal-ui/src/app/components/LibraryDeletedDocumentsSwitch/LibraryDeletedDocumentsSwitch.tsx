import React, { FC } from 'react';
import { Tooltip } from '@mui/material';
import { LocalLibrary } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { getRegistryUrlWithPath } from '../DataManagement/DataManagement.utils';
import { DocumentLibrary } from '../../services/data/docLibrary/docLibrary.models';
import { DeletedDocuments } from '../Icons/DeletedDocuments';
import { IconButton } from '../IconButton/IconButton';

const cnLibraryDeletedDocumentsSwitch = cn('LibraryDeletedDocumentsSwitch');

interface LibraryDeletedDocumentsSwitchProps {
  path: number[];
  library: DocumentLibrary;
  showDeletedDocuments?: boolean;
}

export const LibraryDeletedDocumentsSwitch: FC<LibraryDeletedDocumentsSwitchProps> = ({
  library,
  showDeletedDocuments,
  path
}) => {
  const href = showDeletedDocuments
    ? getRegistryUrlWithPath(library.table_name, path)
    : getRegistryUrlWithPath(library.table_name, path, { is_deleted: true });

  return (
    <Tooltip
      title={showDeletedDocuments ? 'Вернуться в библиотеку документов' : 'Перейти в корзину удалённых документов'}
    >
      <IconButton className={cnLibraryDeletedDocumentsSwitch()} href={href}>
        {showDeletedDocuments ? <LocalLibrary /> : <DeletedDocuments fontSize='medium' color='inherit' />}
      </IconButton>
    </Tooltip>
  );
};
