import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { StringControl } from '../../../StringControl/StringControl';
import { cnFormControl, FormControlProps } from '../Form-Control';

const FormControlTypeString: FC<FormControlProps> = ({ className, ...props }) => (
  <StringControl
    {...props}
    className={cnFormControl({ fullWidthForOldForm: props.fullWidthForOldForm }, [className])}
  />
);

export const withTypeString = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.STRING },
  () => FormControlTypeString
);
