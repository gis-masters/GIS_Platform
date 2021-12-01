import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IconButton, Tooltip } from '@mui/material';
import { GetAppOutlined } from '@mui/icons-material';

import { ActionDetailsDownload } from '../Explorer/Explorer.models';
import { Button } from '../Button/Button';
import { Link } from '../Link/Link';

const cnActionDownload = cn('ActionDownload');

interface ActionDownloadProps {
  fullSizeButton?: boolean;
  iconButton?: boolean;
  actionDetails: ActionDetailsDownload;
}

export const ActionDownload: FC<ActionDownloadProps> = observer(({ actionDetails, fullSizeButton, iconButton }) => {
  const { fileName, url, visible } = actionDetails;

  return (
    visible && (
      <Link className={cnActionDownload()} url={url} download={fileName} theme='none'>
        {fullSizeButton && <Button>Скачать</Button>}
        {iconButton && (
          <Tooltip title='Скачать'>
            <IconButton>
              <GetAppOutlined />
            </IconButton>
          </Tooltip>
        )}
      </Link>
    )
  );
});
