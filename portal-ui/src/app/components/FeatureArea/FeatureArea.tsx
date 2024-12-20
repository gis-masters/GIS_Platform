import React, { FC, memo, useCallback } from 'react';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { CropOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { isPolygonal } from '../../services/geoserver/wfs/wfs.util';
import { mapLabelsService } from '../../services/map/labels/map-labels.service';
import { getSelectedOrActiveFeature } from '../../services/map/labels/map-labels.util';
import { mapStore } from '../../stores/Map.store';
import { sidebars } from '../../stores/Sidebars.store';
import { Toast } from '../Toast/Toast';

const cnFeatureArea = cn('FeatureArea');

const FeatureAreaFC: FC = observer(() => {
  const handleClick = useCallback(async () => {
    try {
      await mapLabelsService.addFeatureArea();
    } catch {
      Toast.error('Не удалось вычислить протяженность объекта');
    }
  }, []);

  const selectedFeature = getSelectedOrActiveFeature();
  const geometryType = selectedFeature?.geometry?.type;

  const disabled =
    !selectedFeature ||
    !mapStore.selectedFeatures.length ||
    (mapStore.selectedFeatures.length > 1 && sidebars.editFeaturesData?.features.length !== 1) ||
    !isPolygonal(geometryType);

  return (
    <Tooltip title={`Отобразить площадь объекта${disabled ? ' (доступно только если выбран один объект)' : ''}`}>
      <span className={cnFeatureArea('Wrapper')}>
        <IconButton className={cnFeatureArea()} onClick={handleClick} disabled={!!disabled} size='small'>
          <CropOutlined />
        </IconButton>
      </span>
    </Tooltip>
  );
});

export const FeatureArea = memo(FeatureAreaFC);
