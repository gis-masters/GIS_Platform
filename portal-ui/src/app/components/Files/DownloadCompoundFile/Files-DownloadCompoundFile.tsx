import React, { Component } from 'react';
import { Tooltip } from '@mui/material';
import { DownloadOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { filesClient } from '../../../services/data/files/files.client';
import { FileInfo } from '../../../services/data/files/files.models';
import { IconButton } from '../../IconButton/IconButton';

const cnFilesDownloadCompoundFile = cn('Files', 'DownloadCompoundFile');

interface FilesDownloadCompoundFileProps {
  item: FileInfo;
}

export class FilesDownloadCompoundFile extends Component<FilesDownloadCompoundFileProps> {
  render() {
    const { item } = this.props;

    return (
      <Tooltip title='Скачать набор файлов архивом'>
        <IconButton
          href={filesClient.getZipDownloadUrl(item.id)}
          download={item.title}
          className={cnFilesDownloadCompoundFile()}
          size='small'
        >
          <DownloadOutlined fontSize='small' />
        </IconButton>
      </Tooltip>
    );
  }
}
