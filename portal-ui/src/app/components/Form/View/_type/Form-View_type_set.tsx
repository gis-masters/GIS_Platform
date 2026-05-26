import React, { type FC } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { RegistryConsumer } from '@bem-react/di';

import { type PropertySchemaSet, PropertyType } from '../../../../services/data/schema/schema.models';
import { type CommonDiRegistry } from '../../../../services/di-registry';
import { type FormControlProps } from '../../Control/Form-Control';
import { FormViewErrors } from '../../ViewErrors/Form-ViewErrors';
import { FormViewWarnings } from '../../ViewWarnings/Form-ViewWarnings';
import { cnFormView } from '../Form-View.base';

import './Form-View_type_set.scss';

const FormViewTypeSet: FC<FormControlProps> = observer(({ className, property, fieldValue = '', errors, warnings }) => {
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
          <FormViewWarnings warnings={warnings} />
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
