import React, { type FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { CancelOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { MapMode } from '../../../services/map/map.models';
import { mapModeService } from '../../../services/map/mode/map-mode.service';
import { mapVerticesModificationStore } from '../../../stores/MapVerticesModification.store';
import { IconButton } from '../../IconButton/IconButton';

const cnVerticesModificationCancel = cn('VerticesModification', 'Cancel');

export const VerticesModificationCancel: FC = observer(() => {
  const handleCancel = useCallback(async () => {
    mapVerticesModificationStore.updateModifiedCollection([]);
    await mapModeService.changeMode(MapMode.SELECTED_FEATURES, undefined, 'verticesModificationCancel');
  }, []);

  return (
    <Tooltip title='Отменить изменения'>
      <span>
        <IconButton
          className={cnVerticesModificationCancel()}
          color='secondary'
          onClick={handleCancel}
          disabled={mapVerticesModificationStore.saving}
        >
          <CancelOutlined />
        </IconButton>
      </span>
    </Tooltip>
  );
});
