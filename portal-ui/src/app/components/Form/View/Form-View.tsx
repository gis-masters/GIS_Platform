import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import nl2br from 'react-nl2br';

import { FormViewErrors } from '../ViewErrors/ViewErrors-ViewErrors';
import { FormViewValue } from '../ViewValue/Form-ViewValue';
import { FormControlProps } from '../Control/Form-Control';
import { FormSetLabel } from '../SetLabel/Form-SetLabel';

import '!style-loader!css-loader!sass-loader!./Form-View.scss';

export const cnFormView = cn('Form', 'View');

export const FormView: FC<FormControlProps> = ({ children, className, property, fieldValue = '—', errors, inSet }) => {
  if (fieldValue === null) {
    fieldValue = '—';
  }

  return (
    <div className={cnFormView({ inSet, empty: fieldValue === '—', type: property.propertyType }, [className])}>
      {inSet && <FormSetLabel>{property.title}:</FormSetLabel>}
      <FormViewValue>{children || nl2br(fieldValue)}</FormViewValue>
      <FormViewErrors errors={errors} />
    </div>
  );
};
