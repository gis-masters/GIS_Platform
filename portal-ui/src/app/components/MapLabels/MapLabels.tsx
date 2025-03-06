import React, { FC, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { DeleteSweepOutlined, LabelOutlined, PolylineOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { LabelType } from '../../services/map/labels/map-labels.models';
import { mapLabelsService } from '../../services/map/labels/map-labels.service';
import { MapAction, ToolMode } from '../../services/map/map.models';
import { konfirmieren } from '../../services/utility-dialogs.service';
import { mapStore } from '../../stores/Map.store';
import { mapLabelsStore } from '../../stores/MapLabels.store';
import { AnnotationSettings } from '../AnnotationSettings/AnnotationSettings';
import { FeatureArea } from '../FeatureArea/FeatureArea';
import { FeatureLength } from '../FeatureLength/FeatureLength';
import { IconButton } from '../IconButton/IconButton';
import { LabelsOutlined } from '../Icons/LabelsOutlined';
import { MapDistances } from '../MapDistances/MapDistances';
import { MapTurningPoints } from '../MapTurningPoints/MapTurningPoints';

import '!style-loader!css-loader!sass-loader!./MapLabels.scss';

const cnMapLabels = cn('MapLabels');

export const MapLabels: FC = observer(() => {
  const handleTogglerClick = useCallback(() => {
    const visible = !mapLabelsStore.labelsVisible;
    mapLabelsStore.setLabelsVisibility(visible);

    localStorage.setItem(mapLabelsService.getStorageKey('visible'), visible.toString());
    if (!visible) {
      mapLabelsService.addingLabelOff();
    }
  }, []);

  const startLabelAdding = useCallback(async (type: LabelType) => {
    if (mapStore.toolMode === ToolMode.ADDING_LABEL && type && mapLabelsStore.currentLabelType === type) {
      mapLabelsService.addingLabelOff();
    } else {
      await mapLabelsService.addingLabelOn(type);
    }
  }, []);

  const handleAddLabelClick = useCallback(async () => {
    await startLabelAdding('label');
  }, [startLabelAdding]);

  const handleAddLineClick = useCallback(async () => {
    await startLabelAdding('line');
  }, [startLabelAdding]);

  const restoreLabelsVisibilityState = useCallback(async () => {
    const labelsVisible = localStorage.getItem(`${mapLabelsService.getStorageKey('visible')}`);
    if (labelsVisible) {
      mapLabelsStore.setLabelsVisibility(labelsVisible === 'true');
      if (labelsVisible === 'true') {
        await mapLabelsService.show();
      }
    }
  }, []);

  const handleClearAllClick = useCallback(async () => {
    if (
      await konfirmieren({
        title: 'Вы уверены, что хотите удалить все аннотации?',
        message: 'Все аннотации будут удалены безвозвратно.'
      })
    ) {
      mapLabelsService.clearAll();
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await restoreLabelsVisibilityState();
    })();
  }, []);

  return (
    <div className={cnMapLabels()}>
      {mapLabelsStore.labelsVisible && (
        <>
          <FeatureArea />
          <FeatureLength />
          <MapTurningPoints />
          <MapDistances />
          <Tooltip title='Добавить аннотацию'>
            <IconButton
              className={cnMapLabels('AddLabel')}
              checked={mapStore.toolMode === ToolMode.ADDING_LABEL && mapLabelsStore.currentLabelType === 'label'}
              onClick={handleAddLabelClick}
              size='small'
            >
              <LabelOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title='Нарисовать вспомогательную линию'>
            <IconButton
              className={cnMapLabels('AddLine')}
              checked={mapStore.toolMode === ToolMode.ADDING_LABEL && mapLabelsStore.currentLabelType === 'line'}
              onClick={handleAddLineClick}
              size='small'
            >
              <PolylineOutlined />
            </IconButton>
          </Tooltip>
          <AnnotationSettings />
          {mapLabelsStore.labels.length > 0 && (
            <Tooltip title='Удалить все аннотации'>
              <IconButton className={cnMapLabels('ClearAll')} onClick={handleClearAllClick} size='small'>
                <DeleteSweepOutlined />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}
      <Tooltip title='Показать/скрыть аннотации'>
        <IconButton
          className={cnMapLabels('Toggler')}
          checked={mapLabelsStore.labelsVisible}
          size='small'
          onClick={handleTogglerClick}
          disabled={!mapStore.allowedActions.includes(MapAction.MAP_LABELS)}
        >
          <LabelsOutlined />
        </IconButton>
      </Tooltip>
    </div>
  );
});
