import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { Gamepad, GamepadOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { mapModeManager } from '../../services/map/a-map-mode/MapModeManager';
import { selectedFeaturesStore } from '../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { MapAction, MapMode } from '../../services/map/map.models';
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
      selectedFeaturesStore.features.length === 0 ||
      !mapStore.allowedActions.includes(MapAction.VERTICES_MODIFICATION) ||
      mapVerticesModificationStore.saving;
    const Icon = this.verticesModificationModeActive() ? Gamepad : GamepadOutlined;
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
  private async editVertex() {
    await (this.verticesModificationModeActive()
      ? mapModeManager.changeMode(MapMode.SELECTED_FEATURES, undefined, 'editVertex - 1')
      : mapModeManager.changeMode(MapMode.VERTICES_MODIFICATION, undefined, 'editVertex - 2'));
  }

  private verticesModificationModeActive(): boolean {
    return mapStore.mode === MapMode.VERTICES_MODIFICATION;
  }
}
