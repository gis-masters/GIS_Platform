import React, { type FC, useCallback, useEffect } from 'react';
import { type IReactionDisposer, reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { MapAction, MapMode } from '../../../services/map/map.models';
import { mapModeService } from '../../../services/map/mode/map-mode.service';
import { mapVerticesModificationService } from '../../../services/map/vertices-modification/map-vertices-modification.service';
import { mapStore } from '../../../stores/Map.store';
import { mapVerticesModificationStore } from '../../../stores/MapVerticesModification.store';
import { selectedFeaturesStore } from '../../../stores/SelectedFeatures.store';
import { IconButton } from '../../IconButton/IconButton';
import { VerticesModification as VerticesModificationIcon } from '../../Icons/VerticesModification';
import { VerticesModificationTooltipText } from '../TooltipText/VerticesModification-TooltipText';

import './VerticesModification-Button.scss';

const cnVerticesModificationButton = cn('VerticesModification', 'Button');

type VerticesModificationButtonState = {
  checkingPermissions: boolean;
  setCheckingPermissions(value: boolean): void;
};

export const VerticesModificationButton: FC = observer(() => {
  const state = useLocalObservable<VerticesModificationButtonState>(() => ({
    checkingPermissions: true,
    setCheckingPermissions(value) {
      this.checkingPermissions = value;
    }
  }));

  useEffect(() => {
    let operationId: symbol | undefined;
    const disposer: IReactionDisposer = reaction(
      () => selectedFeaturesStore.features.map(feature => feature.id).join(','),
      async () => {
        const currentOperationId = Symbol();
        operationId = currentOperationId;
        state.setCheckingPermissions(true);

        await mapVerticesModificationService.resolveUpdatableFeatureIds(selectedFeaturesStore.features);

        if (operationId === currentOperationId) {
          state.setCheckingPermissions(false);
        }
      },
      { fireImmediately: true }
    );

    return () => {
      disposer();
    };
  }, [state]);

  const noFeatures = selectedFeaturesStore.features.length === 0;
  const noUpdatePermission =
    !state.checkingPermissions && !noFeatures && mapVerticesModificationStore.updatableFeatureIds.length === 0;
  const modeActive = mapStore.mode === MapMode.VERTICES_MODIFICATION;
  const actionForbidden = !mapStore.allowedActions.includes(MapAction.VERTICES_MODIFICATION);

  const disabled =
    modeActive ||
    noFeatures ||
    actionForbidden ||
    mapVerticesModificationStore.saving ||
    state.checkingPermissions ||
    noUpdatePermission;

  const tooltipTitle = (() => {
    if (noUpdatePermission) {
      return 'Нет прав на редактирование вершин';
    }
    if (mapVerticesModificationStore.saving) {
      return 'Идёт сохранение';
    }

    return <VerticesModificationTooltipText />;
  })();

  const handleEditVertex = useCallback(async () => {
    const updatableIds = await mapVerticesModificationService.resolveUpdatableFeatureIds(
      selectedFeaturesStore.features
    );
    if (updatableIds.length === 0) {
      return;
    }

    await mapModeService.changeMode(MapMode.VERTICES_MODIFICATION, undefined, 'editVertex');
  }, []);

  return (
    <Tooltip title={tooltipTitle}>
      <span className={cnVerticesModificationButton()}>
        <IconButton onClick={handleEditVertex} disabled={disabled}>
          <VerticesModificationIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
});
