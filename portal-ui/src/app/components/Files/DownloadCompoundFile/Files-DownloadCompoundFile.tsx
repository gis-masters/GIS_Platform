import React, { Component } from 'react';
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
}

export class FilesDownloadCompoundFile extends Component<FilesDownloadCompoundFileProps> {
  render() {
    const { item } = this.props;

    return (
      <Tooltip
        title={
          organizationSettings.downloadFiles
            ? 'Скачать набор файлов архивом'
            : 'Скачивание файлов запрещено администратором'
        }
      >
        <span className={cnFilesItemWrap()}>
          <IconButton
            href={filesClient.getZipDownloadUrl(item.id)}
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
  }
}
