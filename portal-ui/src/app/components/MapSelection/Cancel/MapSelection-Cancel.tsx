import React, { useCallback, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { mapModeManager } from '../../../services/map/a-map-mode/MapModeManager';
import { selectedFeaturesStore } from '../../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { MapAction, MapMode } from '../../../services/map/map.models';
import { mapStore } from '../../../stores/Map.store';
import { IconButton } from '../../IconButton/IconButton';
import { RectangleSelectionCancel } from '../../Icons/RectangleSelectionCancel';

const cnMapSelectionCancel = cn('MapSelection', 'Cancel');

export const MapSelectionCancel = observer(() => {
  const timerRef = useRef(0);
  const escKeyPressedRef = useRef(false);

  const clearSelectedFeatures = useCallback(async (): Promise<void> => {
    await mapModeManager.changeMode(MapMode.NONE, undefined, 'clearSelectedFeatures');
  }, []);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent): void => {
      window.clearTimeout(timerRef.current);

      if (escKeyPressedRef.current && event.key === 'Escape') {
        void clearSelectedFeatures();
      }
    };

    const handleKeyup = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        escKeyPressedRef.current = true;
      }

      timerRef.current = window.setTimeout(() => {
        escKeyPressedRef.current = false;
      }, 400);
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('keyup', handleKeyup);
      window.clearTimeout(timerRef.current);
    };
  }, [clearSelectedFeatures]);

  return (
    <Tooltip title='Снять выделение со всех объектов (Esc, Esc)'>
      <span>
        <IconButton
          disabled={
            !selectedFeaturesStore.features.length || !mapStore.allowedActions.includes(MapAction.MAP_SELECTION)
          }
          className={cnMapSelectionCancel()}
          onClick={clearSelectedFeatures}
          size='small'
        >
          <RectangleSelectionCancel />
        </IconButton>
      </span>
    </Tooltip>
  );
});
