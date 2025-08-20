import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { TextControl } from '../../../TextControl/TextControl';
import { cnFormControl, FormControlProps } from '../Form-Control';

const FormControlTypeText: FC<FormControlProps> = ({ className, ...props }) => (
  <TextControl {...props} className={cnFormControl({ fullWidthForOldForm: props.fullWidthForOldForm }, [className])} />
);

export const withTypeText = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.TEXT },
  () => FormControlTypeText
);
