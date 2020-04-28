import React, { FC, RefObject } from 'react';
import { cn } from '@bem-react/classname';
import { IconButton, Tooltip } from '@material-ui/core';
import { LocationSearching } from '@material-ui/icons';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-CoordPick.scss';

const cnEditFeatureGeometryCoordPick = cn('EditFeatureGeometry', 'CoordPick');

interface EditFeatureGeometryCoordPickProps {
  active: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onBlur: (e: React.FocusEvent<HTMLButtonElement>) => void;
  btnRef: RefObject<HTMLButtonElement>;
  disabled: boolean;
}

export const EditFeatureGeometryCoordPick: FC<EditFeatureGeometryCoordPickProps> = ({
  active,
  onClick,
  onBlur,
  btnRef,
  disabled
}) => (
  <Tooltip title='Указать на карте' enterDelay={800}>
    <span>
      <IconButton className={cnEditFeatureGeometryCoordPick()}
                  onClick={onClick}
                  onBlur={onBlur}
                  aria-label="pick"
                  size="small"
                  ref={btnRef}
                  disabled={disabled}
                  color={active ? 'secondary' : 'default'}>
        <LocationSearching />
      </IconButton>
    </span>
  </Tooltip>
);
