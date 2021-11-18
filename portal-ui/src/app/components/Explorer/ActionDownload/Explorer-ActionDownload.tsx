import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IconButton, Tooltip } from '@mui/material';
import { GetAppOutlined } from '@mui/icons-material';

import { Link } from '../../Link/Link';

import { ExplorerStore } from '../Explorer.store';
import { ActionDetailsDownload } from '../Explorer.models';

const cnExplorerActionDownload = cn('Explorer', 'ActionDownload');

interface ExplorerActionDownloadProps {
  store: ExplorerStore;
  actionDetails: ActionDetailsDownload;
}

export const ExplorerActionDownload: FC<ExplorerActionDownloadProps> = observer(({ actionDetails }) => {
  const { fileName, url, visible } = actionDetails;

  return (
    visible && (
      <Link className={cnExplorerActionDownload()} url={url} download={fileName} theme='none'>
        <Tooltip title='Скачать'>
          <IconButton>
            <GetAppOutlined />
          </IconButton>
        </Tooltip>
      </Link>
    )
  );
});
