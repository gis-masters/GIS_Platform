import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { RegistryConsumer } from '@bem-react/di';
import { withBemMod } from '@bem-react/core';

import { CommonDiRegistry } from '../../../../services/di-registry';
import { PropertySchemaSet, PropertyType } from '../../../../services/data/schema.models';

import { FormHiddenField } from '../../HiddenField/Form-HiddenField';
import { cnFormControl, FormControlProps } from '../Form-Control';
import { FormErrors } from '../../Errors/Form-Errors';

import '!style-loader!css-loader!sass-loader!./Form-Control_type_set.scss';

@observer
class FormControlTypeSet extends Component<FormControlProps> {
  render() {
    const { htmlId, className, property, fieldValue = {}, errors, variant = 'standard' } = this.props;
    const { properties } = property as PropertySchemaSet;

    return (
      <div className={cnFormControl()}>
        <div className={className}>
          <RegistryConsumer id='common'>
            {({ FormControl }: CommonDiRegistry) => (
              <>
                {properties.map((subProperty, i) =>
                  !subProperty.hidden ? (
                    <FormControl
                      htmlId={!i ? htmlId : undefined}
                      key={subProperty.name}
                      property={subProperty}
                      type={subProperty.propertyType}
                      onChange={this.fieldChanged}
                      fieldValue={fieldValue[subProperty.name] as Record<string, unknown>}
                      variant={variant}
                      inSet
                    />
                  ) : (
                    <FormHiddenField
                      key={i}
                      name={String(subProperty.name)}
                      value={fieldValue[subProperty.name] as Record<string, unknown>}
                    />
                  )
                )}
              </>
            )}
          </RegistryConsumer>
        </div>
        <FormErrors errors={errors} />
      </div>
    );
  }

  @boundMethod
  private fieldChanged({ value, propertyName }: { value: unknown; propertyName: string }) {
    const { onChange, property, fieldValue } = this.props;

    onChange({
      value: { ...(fieldValue as Record<string, unknown>), [propertyName]: value },
      propertyName: property.name
    });
  }
}

export const withTypeSet = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.SET },
  () => FormControlTypeSet
);
