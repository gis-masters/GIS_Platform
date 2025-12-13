import React, { type FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { Redo, Undo } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { editFeatureHistoryStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureHistoryStore';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { mapDrawService } from '../../../services/map/draw/map-draw.service';
import { IconButton } from '../../IconButton/IconButton';

const cnEditFeatureGeometryHistoryControls = cn('EditFeatureGeometry', 'HistoryControls');

export const EditFeatureGeometryHistoryControls: FC = observer(() => {
  const handleUndo = useCallback(async () => {
    const previousGeometry = editFeatureHistoryStore.undo();
    if (previousGeometry) {
      editFeatureStore.setGeometry(previousGeometry, false);
      await mapDrawService.syncFeatureGeometryWithMap();
    }
  }, []);

  const handleRedo = useCallback(async () => {
    const nextGeometry = editFeatureHistoryStore.redo();
    if (nextGeometry) {
      editFeatureStore.setGeometry(nextGeometry, false);
      await mapDrawService.syncFeatureGeometryWithMap();
    }
  }, []);

  return (
    <div className={cnEditFeatureGeometryHistoryControls()}>
      <Tooltip title='Отменить'>
        <span>
          <IconButton onClick={handleUndo} disabled={!editFeatureHistoryStore.canUndo} color='primary'>
            <Undo />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title='Вернуть'>
        <span>
          <IconButton onClick={handleRedo} disabled={!editFeatureHistoryStore.canRedo} color='primary'>
            <Redo />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
});
