import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { CropOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { isPolygonal } from '../../services/geoserver/wfs/wfs.util';
import { mapLabelsService } from '../../services/map/labels/map-labels.service';
import { IconButton } from '../IconButton/IconButton';

const cnFeatureArea = cn('FeatureArea');

export const FeatureArea = observer(() => {
  const handleClick = useCallback(async () => {
    await mapLabelsService.addFeatureArea();
  }, []);

  const feature = mapLabelsService.getSelectedOneOrEditedFeature();
  const geometryType = feature?.geometry?.type;

  const disabled = !feature || !isPolygonal(geometryType);

  return (
    <Tooltip title={`Отобразить площадь объекта${disabled ? ' (доступно только если выбран один объект)' : ''}`}>
      <span className={cnFeatureArea('Wrapper')}>
        <IconButton className={cnFeatureArea()} onClick={handleClick} disabled={disabled} size='small'>
          <CropOutlined />
        </IconButton>
      </span>
    </Tooltip>
  );
});
