import React, { FC } from 'react';
import { CircularProgress, Tooltip } from '@mui/material';
import { CancelOutlined, CheckOutlined, LockOutlined, ReportGmailerrorredOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Lookup-Status.scss';

export type LookupStatusType =
  | 'loading'
  | 'success'
  | 'successFadeOut'
  | 'error'
  | 'forbidden'
  | 'new'
  | 'normal'
  | 'notAvailable'
  | 'deleted';

const cnLookupStatus = cn('Lookup', 'Status');

interface LookupStatusProps {
  status: LookupStatusType;
  statusText: string | undefined;
}

export const LookupStatus: FC<LookupStatusProps> = ({ status, statusText }) => (
  <Tooltip title={statusText}>
    <span>
      {((status === 'loading' || status === 'new') && (
        <CircularProgress size={16} className={cnLookupStatus({ status })} disableShrink={status === 'new'} />
      )) ||
        ((status === 'success' || status === 'successFadeOut') && (
          <CheckOutlined color='success' className={cnLookupStatus({ fadeOut: status === 'successFadeOut', status })} />
        )) ||
        (status === 'forbidden' && (
          <LockOutlined color='info' fontSize='small' className={cnLookupStatus({ status })} />
        )) ||
        (status === 'error' && (
          <ReportGmailerrorredOutlined color='error' fontSize='small' className={cnLookupStatus({ status })} />
        )) ||
        (status === 'deleted' && (
          <CancelOutlined fontSize='small' className={cnLookupStatus({ status })} color='warning' />
        )) || <span className={cnLookupStatus({ status })} />}
    </span>
  </Tooltip>
);
