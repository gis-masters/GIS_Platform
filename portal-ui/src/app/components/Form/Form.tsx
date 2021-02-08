import React, { Component } from 'react';
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { generateRandomId } from '../../services/util/randomId';
import { FeatureDescription } from '../../services/crg/schema.models';

import { FormField } from './Field/Form-Field';
import { FormLabel } from './Label/Form-Label';
import { FormControl } from './Control/Form-Control.composed';

import '!style-loader!css-loader!sass-loader!./Form.scss';

export { FormField } from './Field/Form-Field';
export { FormLabel } from './Label/Form-Label';
export { FormControl } from './Control/Form-Control';

export const cnForm = cn('Form');

interface FormProps<T> extends React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
  schema?: FeatureDescription;
  formValue?: T;
  onFormChange?: (changedValue: T) => void;
  onFormSubmit?: (changedValue: T) => void;
}

@observer
export class Form<T extends { [key: string]: unknown }> extends Component<FormProps<T>> {
  private currentFormValue?: T;

  render() {
    const { schema, formValue = {}, children, className, onFormChange, onFormSubmit, ...otherProps } = this.props;

    return (
      <form action='#' onSubmit={this.submitHandler} {...otherProps} className={cnForm(null, [className])}>
        {children}
        {!!schema &&
          schema.properties.map((propertySchema, i) => {
            const htmlId = 'formField_' + generateRandomId();

            return (
              <FormField key={i}>
                <FormLabel htmlFor={htmlId}>{propertySchema.title}</FormLabel>
                <FormControl
                  htmlId={htmlId}
                  property={propertySchema}
                  type={propertySchema.valueType}
                  onChange={this.fieldChanged}
                  fieldValue={formValue[propertySchema.name]}
                >
                  {formValue[propertySchema.name]}
                </FormControl>
              </FormField>
            );
          })}
      </form>
    );
  }

  @boundMethod
  private fieldChanged(itemValue: { value: T[keyof T]; propertyName: keyof T }) {
    const formValue = cloneDeep(this.props.formValue);

    formValue[itemValue.propertyName] = itemValue.value;

    this.currentFormValue = formValue;
    this.props.onFormChange(formValue);
  }

  @boundMethod
  private submitHandler(e: React.FormEvent<HTMLElement>) {
    e.preventDefault();

    const { onFormSubmit, formValue } = this.props;
    if (onFormSubmit) {
      onFormSubmit(this.currentFormValue || formValue);
    }
  }
}
