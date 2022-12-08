import React, { Component } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { Tooltip } from '@mui/material';
import { Share } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { pluralize } from 'numeralize-ru';

import { copyToClipboard } from '../../services/util/clipboard.util';
import { getFeatureUrl } from '../../services/map/map-url.service';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { Toast } from '../Toast/Toast';
import { IconButton } from '../IconButton/IconButton';

const cnCopyUrlButton = cn('CopyUrlButton');

interface CopyUrlButtonProps extends IClassNameProps {
  inHeader?: boolean;
  features?: WfsFeature[];
  onClick?: () => void;
}

export class CopyUrlButton extends Component<CopyUrlButtonProps> {
  render() {
    const { inHeader, features } = this.props;

    return (
      <Tooltip
        title={
          features
            ? `Копировать ссылку на ${pluralize(features.length, 'объект', 'объекты', 'объекты')}`
            : 'Копировать текущую ссылку'
        }
      >
        <IconButton
          className={cnCopyUrlButton({ in: inHeader ? 'header' : 'sidebar' })}
          onClick={this.clickHandler}
          color={inHeader ? 'inherit' : undefined}
        >
          <Share />
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private clickHandler() {
    /* количество объектов может быть больше одного; сейчас это сломано, но уже есть задача на починку #5229 */
    const urlForClipboard = this.props.features ? getFeatureUrl(this.props.features[0]) : location.href;

    copyToClipboard(urlForClipboard);

    Toast.success('Сохранено в буфер обмена');
  }
}
