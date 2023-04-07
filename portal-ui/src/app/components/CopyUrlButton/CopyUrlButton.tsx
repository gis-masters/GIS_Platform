import React, { Component } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { Tooltip } from '@mui/material';
import { Share } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { pluralize } from 'numeralize-ru';

import { Toast } from '../Toast/Toast';
import { IconButton } from '../IconButton/IconButton';
import { getFeaturesUrl } from '../../services/map/map.util';
import { currentProject } from '../../stores/CurrentProject.store';
import { copyToClipboard } from '../../services/util/clipboard.util';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { getLayerByFeatureInCurrentProject } from '../../services/gis/layers/layers.utils';

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
    let urlForClipboard = location.href;
    if (this.props.features) {
      /* количество объектов может быть больше одного; сейчас это сломано, но уже есть задача на починку #5229 */
      const firstFeature = this.props.features[0];
      const layer = getLayerByFeatureInCurrentProject(firstFeature);

      urlForClipboard = getFeaturesUrl(currentProject.id, layer.dataset, layer.tableName, [firstFeature.id]);
    }

    copyToClipboard(urlForClipboard);

    Toast.success('Сохранено в буфер обмена');
  }
}
