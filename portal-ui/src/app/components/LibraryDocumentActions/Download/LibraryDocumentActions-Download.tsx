import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { DownloadOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { libraryClient } from '../../../services/data/library/library.client';
import { LibraryRecord } from '../../../services/data/library/library.models';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';

const cnLibraryDocumentActionsDownload = cn('LibraryDocumentActions', 'Download');

interface LibraryDocumentActionsDownloadProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
}

export const LibraryDocumentActionsDownload: FC<LibraryDocumentActionsDownloadProps> = observer(({ as, document }) => (
  <ActionsItem
    className={cnLibraryDocumentActionsDownload()}
    title='Скачать'
    as={as}
    url={`${libraryClient.getDocLibraryRecordUrl(document.libraryTableName, document.id)}/inner_path/download`}
    download
    icon={<DownloadOutlined />}
  />
));
