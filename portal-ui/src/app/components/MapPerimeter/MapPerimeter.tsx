import React, { FC, memo, useCallback, useEffect, useMemo } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Tooltip } from '@mui/material';
import CropIcon from '@mui/icons-material/Crop';
import { cn } from '@bem-react/classname';

import { isLinear, isPolygonal } from '../../services/geoserver/wfs/wfs.util';
import { mapLabelsService } from '../../services/map/map-labels.service';
import { mapStore } from '../../stores/Map.store';
import { sidebars } from '../../stores/Sidebars.store';
import { IconButton } from '../IconButton/IconButton';

const cnMapPerimeter = cn('MapPerimeter');

type MapPerimeterState = {
  disabled: boolean;
  setDisabled(disabled: boolean): void;
};

const MapPerimeterFC: FC = observer(() => {
  const { disabled, setDisabled } = useLocalObservable(
    (): MapPerimeterState => ({
      disabled: true,
      setDisabled(disabled: boolean): void {
        this.disabled = disabled;
      }
    })
  );

  const handleClick = useCallback(async () => {
    await mapLabelsService.addFeaturePerimeter();
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
        !(isPolygonal(geometryType) || isLinear(geometryType));

      if (result !== disabled) {
        setDisabled(result);
      }
    })();
  }, [hasSelectedFeature, disabled, setDisabled, sidebars.editFeaturesData?.features, mapStore.selectedFeatures]);

  return (
    <Tooltip
      title={`Отобразить периметр объекта${mapStore.selectedFeatures.length ? '' : ' (доступно только для выбранного объекта)'}`}
    >
      <span className={cnMapPerimeter('Wrapper')}>
        <IconButton className={cnMapPerimeter()} onClick={handleClick} disabled={disabled} size='small'>
          <CropIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
});

export const MapPerimeter = memo(MapPerimeterFC);
