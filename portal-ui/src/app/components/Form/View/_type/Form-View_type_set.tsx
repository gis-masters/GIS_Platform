import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { PropertySchemaSet, PropertyType } from '../../../../services/crg/schema.models';

import { cnFormView } from '../Form-View';
import { FormControlProps } from '../../Control/Form-Control';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';

import '!style-loader!css-loader!sass-loader!./Form-View_type_set.scss';

const FormViewTypeSet: FC<FormControlProps> = observer(({ className, property, FormView, fieldValue = '', errors }) => {
  const { fieldsSet } = property as PropertySchemaSet;
  const valueTyped = fieldValue as Record<string, unknown>;

  return (
    <div className={cnFormView(null, [className])}>
      {fieldsSet.map(subProperty => (
        <FormView
          key={subProperty.name}
          property={subProperty}
          type={subProperty.propertyType}
          fieldValue={valueTyped[subProperty.name]}
          FormView={FormView}
          inSet
        />
      ))}
      <FormViewErrors errors={errors} />
    </div>
  );
});

export const withTypeSet = withBemMod<FormControlProps, FormControlProps>(
  cnFormView(),
  { type: PropertyType.SET },
  () => FormViewTypeSet
);
