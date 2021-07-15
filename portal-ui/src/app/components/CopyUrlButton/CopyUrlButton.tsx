import React, { Component } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { IconButton, Tooltip } from '@material-ui/core';
import { Share } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { pluralize } from 'numeralize-ru';

import { copyToClipboard } from '../../services/util/clipboard.util';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { Toast } from '../Toast/Toast';
import { services } from '../../services/services';
import { getFeatureLayer } from '../../services/geoserver/layers.service';
import { currentProject } from '../../stores/CurrentProject.store';
import { MAP_QUERY_PARAMS_DELIMITER } from '../map/map.component';

import '!style-loader!css-loader!sass-loader!./CopyUrlButton.scss';

const cnCopyUrlButton = cn('CopyUrlButton');

interface CopyUrlButtonProps extends IClassNameProps {
  inHeader?: boolean;
  feature?: [WfsFeature];
  onClick?: () => void;
}

export class CopyUrlButton extends Component<CopyUrlButtonProps> {
  render() {
    const { inHeader, feature } = this.props;

    return (
      <Tooltip
        title={
          feature ? `Копировать ссылку на ${pluralize(2, 'объект', 'объекты', 'объекты')}` : 'Копировать текущую ссылку'
        }
      >
        <IconButton
          className={cnCopyUrlButton({ in: inHeader ? 'header' : 'sidebar' })}
          onClick={this.clickHandler}
          color={inHeader ? 'inherit' : 'default'}
        >
          <Share />
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private async clickHandler() {
    await services.provided;

    let urlForClipboard: string;

    if (this.props.feature) {
      const complexName = getFeatureLayer(this.props.feature[0]).complexName;

      if (complexName) {
        const projectMapUrl = `${location.protocol}//${location.host}/projects/${currentProject.id}/map/`;
        const queryParam = `?features=${this.props.feature[0].id}${MAP_QUERY_PARAMS_DELIMITER}${complexName}`;

        urlForClipboard = `${projectMapUrl}${queryParam}`;
      } else {
        const message = 'Ошибка получения слоя объекта';
        services.logger.error(message);
      }
    } else {
      urlForClipboard = location.href;
    }

    copyToClipboard(urlForClipboard);
    Toast.success('Сохранено в буфер обмена');
  }
}
