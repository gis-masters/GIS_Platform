import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { DeleteSweepOutlined, LabelOutlined, PolylineOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { mapStore } from '../../stores/Map.store';
import { mapLabelsService } from '../../services/map/map-labels.service';
import { konfirmieren } from '../../services/utility-dialogs.service';
import { LabelType, MapMode } from '../../services/map/map.models';
import { LabelsOutlined } from '../Icons/LabelsOutlined';
import { IconButton } from '../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./MapLabels.scss';

const cnMapLabels = cn('MapLabels');

@observer
export class MapLabels extends Component {
  async componentDidMount() {
    await this.restoreLabelsVisibilityState();
  }

  render() {
    return (
      <div className={cnMapLabels()}>
        {mapStore.labelsVisible && (
          <>
            <Tooltip title='Добавить аннотацию'>
              <IconButton
                className={cnMapLabels('AddLabel')}
                checked={mapStore.mode === MapMode.ADDING_LABEL && mapStore.currentLabelType === 'label'}
                onClick={this.handleAddLabelClick}
                size='small'
              >
                <LabelOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title='Нарисовать вспомогательную линию'>
              <IconButton
                className={cnMapLabels('AddLine')}
                checked={mapStore.mode === MapMode.ADDING_LABEL && mapStore.currentLabelType === 'line'}
                onClick={this.handleAddLineClick}
                size='small'
              >
                <PolylineOutlined />
              </IconButton>
            </Tooltip>
            {mapStore.labels.length > 0 && (
              <Tooltip title='Удалить все аннотации'>
                <IconButton className={cnMapLabels('ClearAll')} onClick={this.handleClearAllClick} size='small'>
                  <DeleteSweepOutlined />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
        <Tooltip title='Показать/скрыть аннотации'>
          <IconButton
            className={cnMapLabels('Toggler')}
            checked={mapStore.labelsVisible}
            size='small'
            onClick={this.handleTogglerClick}
          >
            <LabelsOutlined />
          </IconButton>
        </Tooltip>
      </div>
    );
  }

  @boundMethod
  private handleTogglerClick() {
    const visible = !mapStore.labelsVisible;
    mapStore.setLabelsVisibility(visible);
    localStorage.setItem(mapLabelsService.getStorageKey('visible'), visible.toString());
    if (!visible) {
      mapLabelsService.addingLabelOff();
    }
  }

  @boundMethod
  private async handleAddLabelClick() {
    await this.startLabelAdding('label');
  }

  @boundMethod
  private async handleAddLineClick() {
    await this.startLabelAdding('line');
  }

  @boundMethod
  private async handleClearAllClick() {
    if (
      await konfirmieren({
        title: 'Вы уверены, что хотите удалить все аннотации?',
        message: 'Все аннотации будут удалены безвозвратно.'
      })
    ) {
      mapLabelsService.clearAll();
    }
  }

  private async startLabelAdding(type: LabelType) {
    if (mapStore.mode === MapMode.ADDING_LABEL && type && mapStore.currentLabelType === type) {
      mapLabelsService.addingLabelOff();
    } else {
      await mapLabelsService.addingLabelOn(type);
    }
  }

  private async restoreLabelsVisibilityState() {
    const labelsVisible = localStorage.getItem(`${mapLabelsService.getStorageKey('visible')}`);
    if (labelsVisible) {
      mapStore.setLabelsVisibility(labelsVisible === 'true');
      if (labelsVisible === 'true') {
        await mapLabelsService.show();
      }
    }
  }
}
