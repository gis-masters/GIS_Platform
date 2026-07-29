import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { services } from '../../services/services';
import { copyToClipboard } from '../../services/util/clipboard.util';
import { type FormControlProps } from '../Form/Control/Form-Control';
import { Toast } from '../Toast/Toast';
import { BboxPreviewCoordinates } from './Coordinates/BboxPreview-Coordinates';
import { BboxPreviewCopyButton } from './CopyButton/BboxPreview-CopyButton';
import { BboxPreviewMap } from './Map/BboxPreview-Map';
import { BboxPreviewValue } from './Value/BboxPreview-Value';

const cnBboxPreview = cn('BboxPreview');

export default observer(({ fieldValue }: FormControlProps) => {
  const bboxString = typeof fieldValue === 'string' ? fieldValue : '';

  const handleCopy = useCallback(() => {
    if (!bboxString) {
      return;
    }

    try {
      copyToClipboard(bboxString);
    } catch (error) {
      services.logger.error('BboxPreview: Ошибка при копировании bbox координат', error);
      Toast.error('Не удалось скопировать bbox координаты');
    }
  }, [bboxString]);

  return (
    <div className={cnBboxPreview()}>
      <BboxPreviewMap bboxString={bboxString} />

      <BboxPreviewValue>
        <BboxPreviewCoordinates>{bboxString || '—'}</BboxPreviewCoordinates>
        {bboxString && (
          <Tooltip title='Копировать координаты в буфер обмена'>
            <BboxPreviewCopyButton onClick={handleCopy} />
          </Tooltip>
        )}
      </BboxPreviewValue>
    </div>
  );
});
