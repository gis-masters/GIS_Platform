import React, { type FC, useCallback } from 'react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { getMapImage, ImageMime } from '../../../services/map/map-print.service';
import { Toast } from '../../Toast/Toast';
import { PrintMapDialogCopyButton } from '../CopyButton/PrintMapDialog-CopyButton';

import './PrintMapDialog-Copy.scss';

const cnPrintMapDialogCopy = cn('PrintMapDialog', 'Copy');

export const PrintMapDialogCopy: FC = () => {
  const handleClick = useCallback(async () => {
    const src = await getMapImage({ mime: ImageMime.PNG, hideScaleDigits: true });
    const request = await fetch(src);
    const blob = await request.blob();

    await navigator.clipboard.write([new ClipboardItem({ [ImageMime.PNG]: blob })]);

    Toast.success('Скопировано в буфер обмена');
  }, []);

  return (
    <Tooltip title='Скопировать изображение в буфер обмена'>
      <div className={cnPrintMapDialogCopy()}>
        <PrintMapDialogCopyButton onClick={handleClick} />
      </div>
    </Tooltip>
  );
};
