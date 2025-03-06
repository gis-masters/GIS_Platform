import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { ArchitectureOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { isLinear, isPolygonal } from '../../services/geoserver/wfs/wfs.util';
import { mapLabelsService } from '../../services/map/labels/map-labels.service';
import { IconButton } from '../IconButton/IconButton';

const cnFeatureLength = cn('FeatureLength');

export const FeatureLength = observer(() => {
  const handleClick = useCallback(async () => {
    await mapLabelsService.addFeatureLength();
  }, []);

  const feature = mapLabelsService.getSelectedOneOrEditedFeature();
  const geometryType = feature?.geometry?.type;

  const disabled = !feature || (!isPolygonal(geometryType) && !isLinear(geometryType));

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
