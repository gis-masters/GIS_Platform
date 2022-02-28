import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { CircularProgress, Tooltip } from '@mui/material';
import { CheckOutlined, ReportGmailerrorredOutlined } from '@mui/icons-material';

import '!style-loader!css-loader!sass-loader!./Files-Status.scss';

import { FileStatusType } from '../Files';

const cnFilesStatus = cn('Files', 'Status');

interface FilesStatusProps {
  status: FileStatusType;
  error: string | undefined;
}

export const FilesStatus: FC<FilesStatusProps> = ({ status, error }) => (
  <>
    {(status === 'loading' || status === 'new') && (
      <CircularProgress size={16} className={cnFilesStatus()} disableShrink={status === 'new'} />
    )}
    {(status === 'success' || status === 'successFadeOut') && (
      <Tooltip title='Загрузка успешно завершена'>
        <CheckOutlined color='success' className={cnFilesStatus({ fadeOut: status === 'successFadeOut' })} />
      </Tooltip>
    )}
    {status === 'error' && (
      <Tooltip title={error}>
        <ReportGmailerrorredOutlined color='error' className={cnFilesStatus()} />
      </Tooltip>
    )}
  </>
);
