import React, { type FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { SaveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { MapMode } from '../../../services/map/map.models';
import { mapModeService } from '../../../services/map/mode/map-mode.service';
import { mapVerticesModificationService } from '../../../services/map/vertices-modification/map-vertices-modification.service';
import { mapVerticesModificationStore } from '../../../stores/MapVerticesModification.store';
import { IconButton } from '../../IconButton/IconButton';

const cnVerticesModificationSave = cn('VerticesModification', 'Save');

export const VerticesModificationSave: FC = observer(() => {
  const handleSave = useCallback(async () => {
    await mapVerticesModificationService.save(mapVerticesModificationStore.modifiedFeatures);
    await mapModeService.changeMode(MapMode.SELECTED_FEATURES, undefined, 'verticesModificationSave');
  }, []);

  return (
    <Tooltip title='Сохранить изменения'>
      <span>
        <IconButton
          className={cnVerticesModificationSave()}
          color='primary'
          onClick={handleSave}
          disabled={mapVerticesModificationStore.modifiedFeatures.length < 1 || mapVerticesModificationStore.saving}
          loading={mapVerticesModificationStore.saving}
        >
          <SaveOutlined />
        </IconButton>
      </span>
    </Tooltip>
  );
});
