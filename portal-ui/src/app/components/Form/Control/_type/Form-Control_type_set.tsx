import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { PropertySchemaSet, PropertyType } from '../../../../services/crg/schema.models';

import { FormHiddenField } from '../../HiddenField/Form-HiddenField';
import { cnFormControl, FormControlProps } from '../Form-Control';
import { FormErrors } from '../../Errors/Form-Errors';

import '!style-loader!css-loader!sass-loader!./Form-Control_type_set.scss';

@observer
class FormControlTypeSet<T extends Record<string, unknown> = Record<string, unknown>> extends Component<
  FormControlProps<T>
> {
  render() {
    const { htmlId, className, property, FormControl, fieldValue = '', errors, variant = 'standard' } = this.props;
    const { fieldsSet } = property as PropertySchemaSet;
    const valueTyped = fieldValue as unknown as Record<string, unknown>;

    return (
      <div className={cnFormControl()}>
        <div className={className}>
          {fieldsSet.map((subProperty, i) =>
            !subProperty.hidden ? (
              <FormControl
                htmlId={!i ? htmlId : undefined}
                key={subProperty.name}
                property={subProperty}
                type={subProperty.propertyType}
                onChange={this.fieldChanged}
                fieldValue={valueTyped[subProperty.name]}
                FormControl={FormControl}
                variant={variant}
                inSet
              >
                {fieldValue}
              </FormControl>
            ) : (
              <FormHiddenField key={i} name={String(subProperty.name)} value={valueTyped[subProperty.name]} />
            )
          )}
        </div>
        <FormErrors errors={errors} />
      </div>
    );
  }

  @boundMethod
  private fieldChanged({ value, propertyName }: { value: T[keyof T]; propertyName: string }) {
    const { onChange, property, fieldValue } = this.props;
    const valueTyped = fieldValue as unknown as Record<string, unknown>;

    onChange({
      value: { ...valueTyped, ...{ [propertyName]: value } },
      propertyName: property.name
    });
  }
}

export const withTypeSet = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.SET },
  () => FormControlTypeSet
);
