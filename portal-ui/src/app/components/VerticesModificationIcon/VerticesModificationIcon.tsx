import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { Gamepad, GamepadOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { mapDrawService } from '../../services/map/draw/map-draw.service';
import { MapAction, MapMode } from '../../services/map/map.models';
import { mapVerticesModificationService } from '../../services/map/vertices-modification/map-vertices-modification.service';
import { wfsFeaturesToFeatures } from '../../services/util/open-layers.util';
import { mapStore } from '../../stores/Map.store';
import { mapVerticesModificationStore } from '../../stores/MapVerticesModification.store';
import { IconButton } from '../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./VerticesModificationIcon.scss';

const cnVerticesModificationIcon = cn('VerticesModificationIcon');

const tooltipMsg = (
  <div className={cnVerticesModificationIcon('TooltipText')}>
    <div>Режим изменения вершин</div>
    <br />
    <div>Щелчок левой кнопки мыши для выбора объекта</div>
    <div>Двойной щелчок левой кнопки мыши для удаления вершин</div>
    <br />
    <div>Shift + щелчок — добавляет объекты</div>
  </div>
);

@observer
export class VerticesModificationIcon extends Component {
  render() {
    const actionDisabled =
      mapStore.selectedFeatures.length === 0 ||
      !mapStore.allowedActions.includes(MapAction.VERTICES_MODIFICATION) ||
      mapVerticesModificationStore.saving;
    const Icon = this.verticesModificationMode() ? Gamepad : GamepadOutlined;
    const color = actionDisabled ? 'disabled' : 'primary';

    return (
      <Tooltip title={tooltipMsg}>
        <IconButton className={cnVerticesModificationIcon()} onClick={this.editVertex} disabled={actionDisabled}>
          <Icon color={color} />
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private editVertex() {
    if (this.verticesModificationMode()) {
      mapVerticesModificationService.verticesModificationOff();
    } else {
      mapVerticesModificationService.verticesModificationOn();
      mapDrawService.addFeatures(wfsFeaturesToFeatures(mapStore.selectedFeatures));
    }
  }

  private verticesModificationMode(): boolean {
    return mapStore.mode === MapMode.VERTICES_MODIFICATION;
  }
}
