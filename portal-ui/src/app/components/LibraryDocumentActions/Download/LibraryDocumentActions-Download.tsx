import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { DownloadOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { LibraryRecord } from '../../../services/data/docLibrary/docLibrary.models';
import { docLibraryClient } from '../../../services/data/docLibrary/docLibrary.client';

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
    url={`${docLibraryClient.getDocLibraryRecordUrl(document.libraryTableName, document.id)}/inner_path/download`}
    download
    icon={<DownloadOutlined />}
  />
));
