import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { ValueType } from '../../../../services/crg/schema.models';

import { cnFormControl, FormControlProps } from '../Form-Control';

import '!style-loader!css-loader!sass-loader!./Form-Control_type_SET.scss';

@observer
class FormControlTypeSet<T = Record<string, unknown>> extends Component<FormControlProps<T>> {
  render() {
    const { htmlId, className, property, FormControl, fieldValue } = this.props;

    return (
      <div className={cnFormControl(null, [className])}>
        {property.fieldsSet.map((subProperty, i) => (
          <FormControl
            htmlId={!i ? htmlId : undefined}
            key={subProperty.name}
            property={subProperty}
            type={subProperty.valueType}
            onChange={this.fieldChanged}
            fieldValue={fieldValue[subProperty.name]}
            FormControl={FormControl}
            inSet
          >
            {fieldValue}
          </FormControl>
        ))}
      </div>
    );
  }

  @boundMethod
  private fieldChanged({ value, propertyName }: { value: T; propertyName: string }) {
    const { onChange, property, fieldValue } = this.props;
    onChange({
      value: { ...fieldValue, ...{ [propertyName]: value } },
      propertyName: property.name
    });
  }
}

export const withTypeSet = withBemMod<{}, FormControlProps>(
  cnFormControl(),
  { type: ValueType.SET },
  () => FormControlTypeSet
);
