import React, { FC, memo, useCallback, useEffect, useMemo } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import { cn } from '@bem-react/classname';

import { isPolygonal } from '../../services/geoserver/wfs/wfs.util';
import { mapLabelsService } from '../../services/map/map-labels.service';
import { mapStore } from '../../stores/Map.store';
import { sidebars } from '../../stores/Sidebars.store';

type MapSquareState = {
  disabled: boolean;
  setDisabled(disabled: boolean): void;
};

const cnMapSquare = cn('MapSquare');

const MapSquareFC: FC = observer(() => {
  const { disabled, setDisabled } = useLocalObservable(
    (): MapSquareState => ({
      disabled: true,
      setDisabled(disabled: boolean): void {
        this.disabled = disabled;
      }
    })
  );

  const handleClick = useCallback(async () => {
    await mapLabelsService.addFeatureSquare();
  }, []);

  const hasSelectedFeature = useMemo(() => {
    const selectedFeatureId = sidebars.editFeaturesData?.features[0].id;

    return !!(selectedFeatureId ? mapStore.getFeatureInSelectionById(selectedFeatureId) : mapStore.selectedFeatures[0]);
  }, [sidebars.editFeaturesData?.features, mapStore.selectedFeatures]);

  useEffect(() => {
    void (async () => {
      if (!hasSelectedFeature) {
        if (!disabled) {
          setDisabled(true);
        }

        return;
      }

      const { geometryType } = await mapLabelsService.getDataForCreateFeatures();

      const result =
        !mapStore.selectedFeatures.length ||
        (mapStore.selectedFeatures.length > 1 && sidebars.editFeaturesData?.features.length !== 1) ||
        !isPolygonal(geometryType);

      if (result !== disabled) {
        setDisabled(result);
      }
    })();
  }, [hasSelectedFeature, disabled, setDisabled, sidebars.editFeaturesData?.features, mapStore.selectedFeatures]);

  return (
    <Tooltip
      title={`Отобразить площадь объекта${mapStore.selectedFeatures.length ? '' : ' (доступно только для выбранного объекта)'}`}
    >
      <span className={cnMapSquare('Wrapper')}>
        <IconButton className={cnMapSquare()} onClick={handleClick} disabled={!!disabled} size='small'>
          <ArchitectureIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
});

export const MapSquare = memo(MapSquareFC);
