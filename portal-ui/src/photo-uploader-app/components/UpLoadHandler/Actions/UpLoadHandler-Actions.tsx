import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { CircularProgress } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { cn } from '@bem-react/classname';

import { CopyUrlButton } from '../../../../app/components/CopyUrlButton/CopyUrlButton';
import { UploadedFileStatus } from '../../../services/photoUploader.models';

import '!style-loader!css-loader!sass-loader!./UpLoadHandler-Actions.scss';
import '!style-loader!css-loader!sass-loader!../WithError/UpLoadHandler-WithError.scss';

interface UpLoadHandlerActionsProps {
  status: UploadedFileStatus | null;
}

const cnUpLoadHandler = cn('UpLoadHandler');

export const UpLoadHandlerActions: FC<UpLoadHandlerActionsProps> = observer(({ status }) => (
  <div className={cnUpLoadHandler('Actions')}>
    {status === UploadedFileStatus.PENDING && <CircularProgress size={20} color='info' />}
    {status === UploadedFileStatus.ERROR && <span className={cnUpLoadHandler('WithError')}>Пропуск</span>}
    {status === UploadedFileStatus.SUCCESS && (
      <>
        {/* заготовка для расшаривания */}
        <CopyUrlButton />
        <DoneIcon color='success' />
      </>
    )}
  </div>
));
