import React, { FC, memo, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { ArchitectureOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { isLinear, isPolygonal } from '../../services/geoserver/wfs/wfs.util';
import { mapLabelsService } from '../../services/map/labels/map-labels.service';
import { mapStore } from '../../stores/Map.store';
import { sidebars } from '../../stores/Sidebars.store';
import { IconButton } from '../IconButton/IconButton';
import { Toast } from '../Toast/Toast';

const cnFeatureLength = cn('FeatureLength');

const FeatureLengthFC: FC = observer(() => {
  const handleClick = useCallback(async () => {
    try {
      await mapLabelsService.addFeatureLength();
    } catch {
      Toast.error('Не удалось вычислить протяженность объекта');
    }
  }, []);

  const selectedFeature = mapLabelsService.getSelectedOrActiveFeature();
  const geometryType = selectedFeature?.geometry?.type;

  const disabled =
    !mapStore.selectedFeatures.length ||
    (mapStore.selectedFeatures.length > 1 && sidebars.editFeaturesData?.features.length !== 1) ||
    (!isPolygonal(geometryType) && !isLinear(geometryType));

  return (
    <Tooltip title={`Отобразить периметр объекта${disabled ? ' (доступно только если выбран один объект)' : ''}`}>
      <span className={cnFeatureLength('Wrapper')}>
        <IconButton className={cnFeatureLength()} onClick={handleClick} disabled={disabled} size='small'>
          <ArchitectureOutlined />
        </IconButton>
      </span>
    </Tooltip>
  );
});

export const FeatureLength = memo(FeatureLengthFC);
