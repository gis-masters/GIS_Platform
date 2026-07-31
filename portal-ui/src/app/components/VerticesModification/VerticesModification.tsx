import React, { type FC } from 'react';
import { observer } from 'mobx-react';
import { ButtonGroup } from '@mui/material';
import { cn } from '@bem-react/classname';

import { MapMode } from '../../services/map/map.models';
import { mapStore } from '../../stores/Map.store';
import { VerticesModificationActions } from './Actions/VerticesModification-Actions';
import { VerticesModificationButton } from './Button/VerticesModification-Button';
import { VerticesModificationCancel } from './Cancel/VerticesModification-Cancel';
import { VerticesModificationFon } from './Fon/VerticesModification-Fon';
import { VerticesModificationSave } from './Save/VerticesModification-Save';

const cnVerticesModification = cn('VerticesModification');
interface VerticesModificationProps {
  showButton?: boolean;
}

export const VerticesModification: FC<VerticesModificationProps> = observer(({ showButton = true }) => (
  <div className={cnVerticesModification()}>
    {mapStore.mode === MapMode.VERTICES_MODIFICATION && (
      <VerticesModificationActions>
        <VerticesModificationFon />
        <ButtonGroup size='small'>
          <VerticesModificationSave />
          <VerticesModificationCancel />
        </ButtonGroup>
      </VerticesModificationActions>
    )}
    {showButton && <VerticesModificationButton />}
  </div>
));
