import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import nl2br from 'react-nl2br';

import { type FormControlProps } from '../Control/Form-Control';
import { FormSetLabel } from '../SetLabel/Form-SetLabel';
import { FormViewErrors } from '../ViewErrors/Form-ViewErrors';
import { FormViewValue } from '../ViewValue/Form-ViewValue';
import { FormViewWarnings } from '../ViewWarnings/Form-ViewWarnings';

import './Form-View.scss';

export const cnFormView = cn('Form', 'View');

export const FormViewBase: FC<FormControlProps> = ({
  children,
  className,
  property,
  fieldValue = '—',
  errors,
  warnings,
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
      <FormViewWarnings warnings={warnings} />
      <FormViewErrors errors={errors} />
    </div>
  );
};
