import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { services } from '../../services/services';
import { copyToClipboard } from '../../services/util/clipboard.util';
import { type FormControlProps } from '../Form/Control/Form-Control';
import { IconButton } from '../IconButton/IconButton';
import { Toast } from '../Toast/Toast';
import { BboxPreviewMap } from './Map/BboxPreview-Map';

import './BboxPreview.scss';
import './Map/BboxPreview-Map.scss';

const cnBboxPreview = cn('BboxPreview');

@observer
export default class BboxPreview extends Component<FormControlProps> {
  render() {
    const { fieldValue } = this.props;
    const bboxString = typeof fieldValue === 'string' ? fieldValue : '';

    return (
      <div className={cnBboxPreview()}>
        <BboxPreviewMap bboxString={bboxString} />

        <div className={cnBboxPreview('Value')}>
          <div className={cnBboxPreview('Coordinates')}>{bboxString || '—'}</div>
          {bboxString && (
            <Tooltip title='Копировать координаты в буфер обмена'>
              <IconButton onClick={this.handleCopy} size='small' className={cnBboxPreview('CopyButton')}>
                <ContentCopy fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
    );
  }

  @boundMethod
  private handleCopy() {
    const { fieldValue } = this.props;
    const bboxString = typeof fieldValue === 'string' ? fieldValue : '';

    if (!bboxString) {
      return;
    }

    try {
      copyToClipboard(bboxString);
    } catch (error) {
      services.logger.error('BboxPreview: Ошибка при копировании bbox координат', error);
      Toast.error('Не удалось скопировать bbox координаты');
    }
  }
}
