import React, { FC } from 'react';
import { Tooltip } from '@mui/material';
import { DownloadOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { filesClient } from '../../../services/data/files/files.client';
import { FileInfo } from '../../../services/data/files/files.models';
import { organizationSettings } from '../../../stores/OrganizationSettings.store';
import { IconButton } from '../../IconButton/IconButton';

const cnFilesItemWrap = cn('Files', 'ItemWrap');
const cnFilesDownloadCompoundFile = cn('Files', 'DownloadCompoundFile');

interface FilesDownloadCompoundFileProps {
  item: FileInfo;
  signed: boolean;
}

export const FilesDownloadCompoundFile: FC<FilesDownloadCompoundFileProps> = ({ item, signed }) => (
  <Tooltip
    title={
      organizationSettings.downloadFiles
        ? 'Скачать набор файлов архивом'
        : 'Скачивание файлов запрещено администратором'
    }
  >
    <span className={cnFilesItemWrap()}>
      <IconButton
        href={signed ? filesClient.getZipDownloadWithEcpUrl(item.id) : filesClient.getZipDownloadUrl(item.id)}
        download={item.title}
        className={cnFilesDownloadCompoundFile()}
        size='small'
        disabled={!organizationSettings.downloadFiles}
      >
        <DownloadOutlined fontSize='small' />
      </IconButton>
    </span>
  </Tooltip>
);
