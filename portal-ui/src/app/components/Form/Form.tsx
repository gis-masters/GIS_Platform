import React, { Component, ReactNode } from 'react';
import { action, IReactionDisposer, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { AxiosError } from 'axios';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep, isEqual } from 'lodash';

import { PropertySchema } from '../../services/crg/schema.models';
import {
  FieldErrors,
  getDefaultValues,
  normalizeServerErrors,
  validateFieldValue,
  validateFormValue
} from '../../services/crg/formValidation.service';
import { FormDialog } from '../FormDialog/FormDialog';

export { FormField } from './Field/Form-Field';
export { FormLabel } from './Label/Form-Label';
import { FormContent } from './Content/Form-Content';
import { FormActions } from './Actions/Form-Actions';
export { FormControl } from './Control/Form-Control.composed';

import '!style-loader!css-loader!sass-loader!./Form.scss';

export const cnForm = cn('Form');

export interface FormProps<T extends Record<string, unknown>>
  extends Omit<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'ref'> {
  fields?: PropertySchema<T>[];
  value?: T;
  errors?: FieldErrors[];
  onFormChange?(changedValue: T): void;
  onFormSubmit?(changedValue: T): void;
  onFieldChange?(value: T[keyof T], propertyName: string, prevValue: T[keyof T]): void;
  onFieldNeedValidate?(value: T[keyof T], propertyName: keyof T): void;
  onActionSuccess?(changedValue: T): void;
  onActionError?(error: Error | { errors: FieldErrors[] }): void;
  actions?: ReactNode;
  readonly?: boolean;
  auto?: boolean;
  actionFunction?: (value: T) => Promise<void> | void;
  invoke?: {
    setValue?(value: T): void;
    validate?(): void;
    reset?(): void;
  };
}

@observer
export class Form<T extends Record<string, unknown> = Record<string, unknown>> extends Component<FormProps<T>> {
  private initialValue: Partial<T>;
  @observable private value?: Partial<T>;
  @observable private errors?: FieldErrors[];
  @observable private serverErrors?: FieldErrors[];
  private valueReactionDisposer: IReactionDisposer;

  constructor(props: FormProps<T>) {
    super(props);

    if (props.fields) {
      this.value = cloneDeep(props.value || getDefaultValues(props.fields));
      this.initialValue = cloneDeep(this.value);
    }
  }

  componentDidMount() {
    if (this.props.invoke) {
      this.props.invoke.setValue = this.setValue;
      this.props.invoke.validate = this.validate;
      this.props.invoke.reset = this.reset;
    }
    this.valueReactionDisposer = reaction(
      () => cloneDeep(this.props.value),
      value => {
        if (!isEqual(value, this.initialValue)) {
          this.setValue(value);
          this.initialValue = cloneDeep(value);
        }
      }
    );
  }

  componentDidUpdate() {
    if (!isEqual(this.props.value, this.initialValue)) {
      this.setValue(cloneDeep(this.props.value));
      this.initialValue = cloneDeep(this.props.value);
    }
  }

  componentWillUnmount() {
    this.valueReactionDisposer();
  }

  render() {
    const {
      fields,
      children,
      className,
      errors,
      onFormChange,
      onFormSubmit,
      onFieldChange,
      onFieldNeedValidate,
      onActionSuccess,
      onActionError,
      actions,
      readonly,
      actionFunction,
      auto,
      invoke,
      ...otherProps
    } = this.props;

    return (
      <form action='#' onSubmit={this.submitHandler} {...otherProps} className={cnForm({ readonly }, [className])}>
        {children}
        {!!fields && (
          <FormContent<T>
            fields={fields}
            formValue={this.value}
            Form={Form}
            FormDialog={FormDialog}
            onFormChange={this.changeHandler}
            onFieldChange={this.fieldChanged}
            onFieldNeedValidate={this.fieldValidate}
            errors={[...(errors || []), ...(this.serverErrors || []), ...(this.errors || [])]}
            readonly={readonly}
          />
        )}
        {actions && <FormActions>{actions}</FormActions>}
      </form>
    );
  }

  @boundMethod
  private changeHandler(changedValue: T) {
    const { onFormChange, auto } = this.props;

    if (auto) {
      this.setValue(changedValue);
    }

    if (onFormChange) {
      onFormChange(changedValue);
    }
  }

  @boundMethod
  private async submitHandler(e: React.FormEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();

    const { onFormSubmit, value, auto, actionFunction, onActionError } = this.props;
    if (onFormSubmit) {
      onFormSubmit(auto ? (this.value as T) : value);
    }

    if (auto && actionFunction) {
      const errors = this.validate();

      if (errors.length) {
        onActionError({ errors });

        return;
      }

      await this.doAction();
    }
  }

  @boundMethod
  private validate() {
    const { fields } = this.props;
    const errors = validateFormValue(this.value, fields as PropertySchema[]);
    this.setErrors(errors);

    return errors;
  }

  private async doAction() {
    const { actionFunction, onActionSuccess, onActionError } = this.props;

    try {
      await actionFunction(this.value as T);
      if (onActionSuccess) {
        onActionSuccess(this.value as T);
      }
    } catch (error) {
      if (onActionError) {
        onActionError(error);
        const err = error as AxiosError<{ errors?: FieldErrors[] }>;

        if (err?.response?.data?.errors) {
          this.setServerErrors(normalizeServerErrors(err.response.data.errors));
        }
      }
    }
  }

  @action.bound
  private setValue(value: T) {
    this.value = value;
  }

  @action
  private setErrors(errors: FieldErrors[] = []) {
    this.errors = errors.filter(({ messages }) => messages?.length);
  }

  @action
  private setServerErrors(errors?: FieldErrors[]) {
    this.serverErrors = errors;
  }

  @boundMethod
  private fieldChanged(value: T[keyof T], fieldName: string, prevValue: T[keyof T]) {
    const { auto, onFieldChange } = this.props;

    if (auto) {
      this.filterFieldErrors(fieldName);
    }

    if (onFieldChange) {
      onFieldChange(value, fieldName, prevValue);
    }
  }

  @boundMethod
  private fieldValidate(value: T[keyof T], fieldName: string) {
    const { auto, fields, onFieldNeedValidate } = this.props;
    const field = fields.find(({ name }) => name === fieldName) as PropertySchema;

    if (auto) {
      this.filterFieldErrors(fieldName);
      this.setErrors([...this.errors, validateFieldValue(value, field, this.value, fields as PropertySchema[])]);
    }

    if (onFieldNeedValidate) {
      onFieldNeedValidate(value, fieldName);
    }
  }

  private filterFieldErrors(fieldName: string) {
    this.setErrors(this.errors?.filter(({ field }) => field !== fieldName));
    this.setServerErrors(this.serverErrors?.filter(({ field }) => field !== fieldName));
  }

  @boundMethod
  private reset() {
    this.setErrors();
    this.setServerErrors();
    this.setValue(cloneDeep(this.props.value));
  }
}
