import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { PropertySchema } from '../../services/crg/schema.models';
import { FieldErrors } from '../../services/crg/formValidation.service';

export { FormField } from './Field/Form-Field';
import { FormContent } from './Content/Form-Content';
export { FormLabel } from './Label/Form-Label';
export { FormControl } from './Control/Form-Control.composed';

import '!style-loader!css-loader!sass-loader!./Form.scss';

export const cnForm = cn('Form');

interface FormProps<T extends Record<string, unknown>>
  extends React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
  fields?: PropertySchema<T>[];
  value?: T;
  errors?: FieldErrors[];
  onFormChange?: (changedValue: T) => void;
  onFormSubmit?: (changedValue: T) => void;
  onFieldChange?: (value: T[keyof T], propertyName: string) => void;
  onFieldNeedValidate?: (value: T[keyof T], propertyName: keyof T) => void;
}

@observer
export class Form<T extends Record<string, unknown> = Record<string, unknown>> extends Component<FormProps<T>> {
  render() {
    const {
      fields,
      value = {} as T,
      children,
      className,
      errors,
      onFormChange,
      onFormSubmit,
      onFieldChange,
      onFieldNeedValidate,
      ...otherProps
    } = this.props;

    return (
      <form action='#' onSubmit={this.submitHandler} {...otherProps} className={cnForm(null, [className])}>
        {children}
        {!!fields && (
          <FormContent<T>
            fields={fields}
            formValue={value}
            onFormChange={onFormChange}
            onFieldChange={onFieldChange}
            onFieldNeedValidate={onFieldNeedValidate}
            errors={errors}
          />
        )}
      </form>
    );
  }

  @boundMethod
  private submitHandler(e: React.FormEvent<HTMLElement>) {
    e.preventDefault();

    const { onFormSubmit, value: formValue } = this.props;
    if (onFormSubmit) {
      onFormSubmit(formValue);
    }
  }
}
