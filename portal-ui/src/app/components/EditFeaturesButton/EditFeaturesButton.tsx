import React, { type FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { type WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { EditFeatureMode } from '../../services/map/a-map-mode/edit-feature/EditFeature.models';
import { mapModeManager } from '../../services/map/a-map-mode/MapModeManager';
import { MapMode } from '../../services/map/map.models';
import { IconButton } from '../IconButton/IconButton';

const cnEditFeaturesButton = cn('EditFeaturesButton');

interface EditFeaturesButtonProps {
  label: string;
  features: WfsFeature[];
}

export const EditFeaturesButton: FC<EditFeaturesButtonProps> = observer(({ label, features }) => {
  const handleMultipleEdit = useCallback(async () => {
    await mapModeManager.changeMode(
      MapMode.EDIT_FEATURE,
      {
        payload: {
          features,
          mode: features.length > 1 ? EditFeatureMode.multipleEdit : EditFeatureMode.single
        }
      },
      'multipleEdit'
    );
  }, [features]);

  return (
    <Tooltip title={`Редактировать${label}`}>
      <span>
        <IconButton className={cnEditFeaturesButton()} size='small' onClick={handleMultipleEdit}>
          <EditOutlined fontSize='small' />
        </IconButton>
      </span>
    </Tooltip>
  );
});
