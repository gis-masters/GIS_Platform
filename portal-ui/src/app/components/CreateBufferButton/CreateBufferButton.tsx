import React, { FC, useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { CrgLayer } from '../../services/gis/layers/layers.models';
import { editFeatureStore } from '../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { CreateBufferDialog } from '../CreateBufferDialog/CreateBufferDialog';
import { IconButton } from '../IconButton/IconButton';
import { BufferAdd } from '../Icons/Buffer';

const cnCreateBufferButton = cn('CreateBufferButton');

interface CreateBufferButtonProps {
  tooltipTitle: string;
  layer: CrgLayer;
  feature: WfsFeature;
  size?: 'small' | 'medium';
}

export const CreateBufferButton: FC<CreateBufferButtonProps> = observer(({ tooltipTitle, layer, feature, size }) => {
  const [open, setOpen] = useState(false);

  const closeDialog = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const openDialog = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  return (
    <>
      <Tooltip title={tooltipTitle}>
        <span>
          <IconButton
            className={cnCreateBufferButton()}
            size={size}
            onClick={openDialog}
            disabled={editFeatureStore.dirty}
          >
            <BufferAdd />
          </IconButton>
        </span>
      </Tooltip>

      <CreateBufferDialog feature={feature} layer={layer} open={open} onClose={closeDialog} />
    </>
  );
});
