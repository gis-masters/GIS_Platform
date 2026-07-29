import React, { Component } from 'react';
import { Tooltip } from '@mui/material';
import { Share } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { pluralize } from 'numeralize-ru';

import { type VectorTable } from '../../services/data/vectorData/vectorData.models';
import { type WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { isExternalLayer } from '../../services/gis/layers/layers.typeguards';
import { getLayerByFeatureInCurrentProject } from '../../services/gis/layers/layers.utils';
import { getFeaturesUrl } from '../../services/map/map.util';
import { copyToClipboard } from '../../services/util/clipboard.util';
import { currentProject } from '../../stores/CurrentProject.store';
import { IconButton } from '../IconButton/IconButton';
import { Toast } from '../Toast/Toast';

const cnCopyUrlButton = cn('CopyUrlButton');

interface CopyUrlButtonProps extends IClassNameProps {
  inHeader?: boolean;
  features?: WfsFeature[];
  vectorTable?: VectorTable;
  onClick?(): void;
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
        <span>
          <IconButton
            className={cnCopyUrlButton({ in: inHeader ? 'header' : 'sidebar' })}
            onClick={this.handleClick}
            color={inHeader ? 'inherit' : undefined}
          >
            <Share />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  @boundMethod
  private handleClick() {
    const { features, vectorTable } = this.props;

    let urlForClipboard = location.href;
    if (features) {
      /* количество объектов может быть больше одного; сейчас это сломано, но уже есть задача на починку #5229 */
      const firstFeature = this.props.features?.[0];

      if (!firstFeature) {
        throw new Error('Не передан объект');
      }

      const layer = getLayerByFeatureInCurrentProject(firstFeature);

      if (!layer || isExternalLayer(layer) || !layer.dataset) {
        throw new Error('Не найден слой');
      }

      urlForClipboard = getFeaturesUrl(currentProject.id, layer.dataset, layer.resourceId, [firstFeature.id]);
    } else if (vectorTable) {
      const { dataset, identifier } = vectorTable;

      urlForClipboard = `${window.location.origin}/data-management/dataset/${dataset}/vectorTable/${identifier}/registry`;
    }

    copyToClipboard(urlForClipboard);

    Toast.success('Сохранено в буфер обмена');
  }
}
