import React, { Component, ReactNode } from 'react';
import { action, IReactionDisposer, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { AxiosError } from 'axios';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep } from 'lodash';

import { PropertySchema, Schema } from '../../services/crg/schema.models';
import {
  calculateValues,
  FieldErrors,
  getDefaultValues,
  normalizeServerErrors,
  validateFieldValue,
  validateFormValue
} from '../../services/crg/formValidation.service';

export { FormField } from './Field/Form-Field';
export { FormLabel } from './Label/Form-Label';
import { FormContent } from './Content/Form-Content';
import { FormActions } from './Actions/Form-Actions';
import { isEqualExceptCalculated } from './Form.utils';
export { FormControl } from './Control/Form-Control.composed';

import '!style-loader!css-loader!sass-loader!./Form.scss';

const cnForm = cn('Form');

export interface FormProps<T extends Record<string, unknown>>
  extends Omit<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'ref'> {
  schema?: Schema<T>;
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

    const properties = props.schema?.properties;

    if (props.schema?.properties) {
      this.value = calculateValues(cloneDeep(props.value || getDefaultValues(properties)), properties);
      this.initialValue = calculateValues(this.value, properties);
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
        if (!isEqualExceptCalculated(value, this.initialValue, this.props.schema)) {
          this.setValue(calculateValues(value, this.props.schema?.properties));
          this.initialValue = cloneDeep(value);
        }
      }
    );
  }

  componentDidUpdate() {
    const { value, schema } = this.props;
    if (!isEqualExceptCalculated(value, this.initialValue, schema)) {
      this.setValue(calculateValues(value, schema?.properties));
      this.initialValue = cloneDeep(value);
    }
  }

  componentWillUnmount() {
    this.valueReactionDisposer();
  }

  render() {
    const {
      schema,
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
        {!!schema && (
          <FormContent<T>
            schema={schema}
            formValue={this.value}
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
    const { onFormChange, auto, schema } = this.props;
    const value = calculateValues(changedValue, schema.properties);

    if (auto) {
      this.setValue(value);
    }

    if (onFormChange) {
      onFormChange(value);
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
    const { schema } = this.props;
    const errors = validateFormValue(this.value, schema.properties as PropertySchema[]);
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
      const errors: FieldErrors[] = Array.isArray(error)
        ? (error as FieldErrors[])
        : (error as AxiosError<{ errors?: FieldErrors[] }>)?.response?.data?.errors;

      if (onActionError) {
        onActionError(error as AxiosError<{ errors?: FieldErrors[] }>);

        if (errors) {
          this.setServerErrors(normalizeServerErrors(errors));
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
    const { auto, schema, onFieldNeedValidate } = this.props;
    const field = schema.properties?.find(({ name }) => name === fieldName) as PropertySchema;

    if (auto) {
      this.filterFieldErrors(fieldName);
      this.setErrors([
        ...this.errors,
        validateFieldValue(value, field, this.value, schema.properties as PropertySchema[])
      ]);
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
