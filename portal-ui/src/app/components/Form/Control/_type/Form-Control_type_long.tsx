import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { cnFormControl, FormControlProps } from '../Form-Control';
import { FormControlTypeNumber } from './Form-Control_type_number';

const FormControlTypeLong: FC<FormControlProps> = observer(props => (
  <FormControlTypeNumber {...props} className={cnFormControl({ fullWidthForOldForm: props.fullWidthForOldForm })} />
));

export const withTypeLong = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.LONG },
  () => FormControlTypeLong
);
