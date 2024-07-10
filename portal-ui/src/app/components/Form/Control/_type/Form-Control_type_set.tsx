import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { RegistryConsumer } from '@bem-react/di';
import { boundMethod } from 'autobind-decorator';

import { PropertySchemaSet, PropertyType } from '../../../../services/data/schema/schema.models';
import { CommonDiRegistry } from '../../../../services/di-registry';
import { isRecordStringUnknown } from '../../../../services/util/typeGuards/isRecordStringUnknown';
import { FormErrors } from '../../Errors/Form-Errors';
import { FormHiddenField } from '../../HiddenField/Form-HiddenField';
import { cnFormControl, FormControlProps } from '../Form-Control';

import '!style-loader!css-loader!sass-loader!./Form-Control_type_set.scss';

@observer
class FormControlTypeSet extends Component<FormControlProps> {
  render() {
    const { htmlId, className, property, fieldValue = {}, errors, variant = 'standard' } = this.props;
    const { properties } = property as PropertySchemaSet;

    const value: Record<string, unknown> = isRecordStringUnknown(fieldValue) ? fieldValue : {};

    return (
      <div className={cnFormControl()}>
        <div className={className}>
          <RegistryConsumer id='common'>
            {({ FormControl }: CommonDiRegistry) => (
              <>
                {properties.map((subProperty, i) =>
                  subProperty.hidden ? (
                    <FormHiddenField
                      key={i}
                      name={String(subProperty.name)}
                      value={value[subProperty.name] as Record<string, unknown>}
                    />
                  ) : (
                    <FormControl
                      htmlId={i ? undefined : htmlId}
                      key={subProperty.name}
                      property={subProperty}
                      type={subProperty.propertyType}
                      onChange={this.fieldChanged}
                      fieldValue={value[subProperty.name] as Record<string, unknown>}
                      variant={variant}
                      inSet
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

    onChange?.({
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
