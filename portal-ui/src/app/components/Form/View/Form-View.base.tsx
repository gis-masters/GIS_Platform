import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import nl2br from 'react-nl2br';

import { FormControlProps } from '../Control/Form-Control';
import { FormSetLabel } from '../SetLabel/Form-SetLabel';
import { FormViewErrors } from '../ViewErrors/ViewErrors-ViewErrors';
import { FormViewValue } from '../ViewValue/Form-ViewValue';

import '!style-loader!css-loader!sass-loader!./Form-View.scss';

export const cnFormView = cn('Form', 'View');

export const FormViewBase: FC<FormControlProps> = ({
  children,
  className,
  property,
  fieldValue = '—',
  errors,
  fullWidthForOldForm,
  inSet
}) => {
  if (fieldValue === null) {
    fieldValue = '—';
  }

  return (
    <div
      className={cnFormView({ inSet, fullWidthForOldForm, empty: fieldValue === '—', type: property.propertyType }, [
        className
      ])}
    >
      {inSet && <FormSetLabel>{property.title}:</FormSetLabel>}
      <FormViewValue>{children || nl2br(String(fieldValue))}</FormViewValue>
      <FormViewErrors errors={errors} />
    </div>
  );
};
