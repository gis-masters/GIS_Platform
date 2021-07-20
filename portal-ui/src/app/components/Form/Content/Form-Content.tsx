import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';
import { cloneDeep } from 'lodash';

import { PropertySchema } from '../../../services/crg/schema.models';
import { generateRandomId } from '../../../services/util/randomId';

import { FormField } from '../Field/Form-Field';
import { FormLabel } from '../Label/Form-Label';
import { FormControl } from '../Control/Form-Control.composed';
import { FormHiddenField } from '../HiddenField/Form-HiddenField';

const cnFormContent = cn('Form', 'Content');

interface FormContentProps<T extends Record<string, unknown>> extends IClassNameProps {
  fields: PropertySchema<T>[];
  formValue: T;
  onFormChange?: (changedValue: T) => void;
}

@observer
export class FormContent<T extends Record<string, unknown> = Record<string, unknown>> extends Component<
  FormContentProps<T>
> {
  render() {
    const { fields, formValue, className } = this.props;

    return (
      <div className={cnFormContent(null, [className])}>
        {fields.map((propertySchema: PropertySchema, i) => {
          const htmlId = 'formField_' + generateRandomId();

          return !propertySchema.hidden ? (
            <FormField key={i}>
              <FormLabel htmlFor={htmlId}>{propertySchema.title}</FormLabel>
              <FormControl
                htmlId={htmlId}
                property={propertySchema}
                type={propertySchema.valueType}
                onChange={this.fieldChanged}
                fieldValue={formValue[propertySchema.name]}
                FormControl={FormControl}
              >
                {formValue[propertySchema.name]}
              </FormControl>
            </FormField>
          ) : (
            <FormHiddenField key={i} name={String(propertySchema.name)} value={formValue[propertySchema.name]} />
          );
        })}
      </div>
    );
  }

  @boundMethod
  private fieldChanged({ value, propertyName }: { value: T[keyof T]; propertyName: keyof T }) {
    const { formValue, onFormChange } = this.props;
    if (onFormChange) {
      const newFormValue = cloneDeep(formValue);
      newFormValue[propertyName] = value;
      onFormChange(newFormValue);
    }
  }
}
