import React, { FC, useCallback } from 'react';
import { cn } from '@bem-react/classname';

import { isProjection, Projection } from '../../services/data/projections/projections.models';
import { FormControlProps } from '../Form/Control/Form-Control';
import { SelectProjection } from '../SelectProjection/SelectProjection';

const cnSelectProjectionControl = cn('SelectProjectionControl');

export const SelectProjectionControl: FC<FormControlProps> = ({ fieldValue, property, onChange }) => {
  const handleSelect = useCallback(
    (projection: Projection) => {
      onChange?.({ value: projection, propertyName: property.name });
    },
    [property, onChange]
  );

  return (
    <SelectProjection
      className={cnSelectProjectionControl()}
      onChange={handleSelect}
      value={isProjection(fieldValue) ? fieldValue : undefined}
      fullWidth
    />
  );
};
