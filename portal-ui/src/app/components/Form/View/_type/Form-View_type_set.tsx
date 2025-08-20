import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { RegistryConsumer } from '@bem-react/di';

import { PropertySchemaSet, PropertyType } from '../../../../services/data/schema/schema.models';
import { CommonDiRegistry } from '../../../../services/di-registry';
import { FormControlProps } from '../../Control/Form-Control';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';
import { cnFormView } from '../Form-View.base';

import '!style-loader!css-loader!sass-loader!./Form-View_type_set.scss';

const FormViewTypeSet: FC<FormControlProps> = observer(({ className, property, fieldValue = '', errors }) => {
  const { properties } = property as PropertySchemaSet;
  const valueTyped = fieldValue as Record<string, unknown>;

  return (
    <RegistryConsumer id='common'>
      {({ FormView }: CommonDiRegistry) => (
        <div className={cnFormView(null, [className])}>
          {properties.map(subProperty => (
            <FormView
              key={subProperty.name}
              property={subProperty}
              type={subProperty.propertyType}
              fieldValue={valueTyped[subProperty.name]}
              inSet
            />
          ))}
          <FormViewErrors errors={errors} />
        </div>
      )}
    </RegistryConsumer>
  );
});

export const withTypeSet = withBemMod<FormControlProps, FormControlProps>(
  cnFormView(),
  { type: PropertyType.SET },
  () => FormViewTypeSet
);
