import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { PropertySchema } from '../../services/crg/schema.models';

import { FormContent } from './Content/Form-Content';

import '!style-loader!css-loader!sass-loader!./Form.scss';

export { FormField } from './Field/Form-Field';
export { FormLabel } from './Label/Form-Label';
export { FormContent } from './Content/Form-Content';
export { FormControl } from './Control/Form-Control.composed';

export const cnForm = cn('Form');

interface FormProps<T> extends React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
  fields?: PropertySchema[];
  formValue?: T;
  onFormChange?: (changedValue: T) => void;
  onFormSubmit?: (changedValue: T) => void;
}

@observer
export class Form<T extends { [key: string]: unknown }> extends Component<FormProps<T>> {
  render() {
    const { fields, formValue = {}, children, className, onFormChange, onFormSubmit, ...otherProps } = this.props;

    return (
      <form action='#' onSubmit={this.submitHandler} {...otherProps} className={cnForm(null, [className])}>
        {children}
        {!!fields && <FormContent fields={fields} formValue={formValue} onFormChange={onFormChange} />}
      </form>
    );
  }

  @boundMethod
  private submitHandler(e: React.FormEvent<HTMLElement>) {
    e.preventDefault();

    const { onFormSubmit, formValue } = this.props;
    if (onFormSubmit) {
      onFormSubmit(formValue);
    }
  }
}
