import React, { Component, type DetailedHTMLProps, type FormHTMLAttributes, type ReactNode } from 'react';
import { action, computed, type IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { type AxiosError } from 'axios';
import { cloneDeep } from 'lodash';

import { doConfirm, type DoConfirmOptions } from '../../services/answer-modals.service';
import { type Schema, type SimpleSchema } from '../../services/data/schema/schema.models';
import { services } from '../../services/services';
import { FormFieldErrorsError } from '../../services/util/form/FormFieldErrorsError';
import {
  calculateValues,
  cleanCalculatedValues,
  type FieldErrors,
  isFieldErrors,
  normalizeServerErrors,
  validateFieldValue,
  validateFieldWarnings,
  validateFormValue,
  validateFormWarnings
} from '../../services/util/form/formValidation.utils';
import { notFalsyFilter } from '../../services/util/NotFalsyFilter';
import { isArrayOf } from '../../services/util/typeGuards/isArrayOf';
import { FormActions } from './Actions/Form-Actions';
import { FormContent } from './Content/Form-Content';
import { FormErrors } from './Errors/Form-Errors';
import { type FormRole } from './Form.models';
import { computeDynamicProperties, getDefaultValues, isEqualExceptCalculated } from './Form.utils';

import './Form.scss';

const cnForm = cn('Form');

export interface FormProps<T>
  extends Omit<DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'ref'> {
  schema?: Schema | SimpleSchema;
  value?: Partial<T>;
  errors?: FieldErrors[];
  onFormChange?(changedValue: T): void;
  onFormSubmit?(changedValue: T): void;
  onFieldChange?(
    value: T[keyof T],
    propertyName: string,
    prevValue: T[keyof T] | undefined,
    formValue: Partial<T>
  ): void;
  onFieldNeedValidate?(value: T[keyof T], propertyName: keyof T | string): void;
  onActionSuccess?(changedValue: T): void;
  onActionError?(error: Error | { errors: FieldErrors[] }): void;
  actions?: ReactNode;
  readonly?: boolean;
  formRole?: FormRole;
  labelInField?: boolean;
  auto?: boolean;
  actionFunction?(value: T | Partial<T>): Promise<void> | void;
  confirmOnWarnings?: boolean;
  warningsConfirmOptions?: DoConfirmOptions;
  onActionAborted?(): void;
  invoke?: {
    setValue?(value: T): void;
    validate?(): void;
    reset?(): void;
  };
}

@observer
export default class Form<T> extends Component<FormProps<T>> {
  private initialValue: Partial<T> = {};
  @observable private value?: Partial<T>;
  @observable private errors?: FieldErrors[];
  @observable private warnings?: FieldErrors[];
  @observable private serverErrors?: FieldErrors[];
  @observable private hiddenFieldsErrors: string[] = [];
  @observable private hiddenFieldsWarnings: string[] = [];
  @observable private generalServerErrors: string[] = [];
  private valueReactionDisposer?: IReactionDisposer;

  constructor(props: FormProps<T>) {
    super(props);
    makeObservable(this);

    const properties = props.schema?.properties;

    if (properties) {
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

    if (this.props.auto && this.props.schema?.properties.some(({ warningFormula }) => warningFormula)) {
      this.validateWarnings();
    }

    this.valueReactionDisposer = reaction(
      () => cloneDeep(this.props.value),
      value => {
        const { schema } = this.props;
        if (schema && !isEqualExceptCalculated(value, this.initialValue, schema)) {
          this.setValue(calculateValues(value, schema.properties));
          this.initialValue = cloneDeep(value || {});
        }
      }
    );
  }

  componentDidUpdate() {
    const { value, schema } = this.props;
    if (schema && !isEqualExceptCalculated(value, this.initialValue, schema)) {
      this.setValue(calculateValues(value, schema?.properties));
      this.initialValue = cloneDeep(value || {});
    }
  }

  componentWillUnmount() {
    this.valueReactionDisposer?.();
  }

  render() {
    const {
      schema,
      children,
      className,
      errors,
      value,
      onFormChange,
      onFormSubmit,
      onFieldChange,
      onFieldNeedValidate,
      onActionSuccess,
      onActionError,
      actions,
      readonly,
      formRole,
      labelInField,
      actionFunction,
      auto,
      invoke,
      ...otherProps
    } = this.props;

    return (
      <form action='#' onSubmit={this.handleSubmit} {...otherProps} className={cnForm({ readonly }, [className])}>
        {children}
        {!!this.schema && (
          <FormContent<T>
            schema={this.schema}
            formRole={formRole}
            formValue={this.value || {}}
            onFormChange={this.handleChange}
            onFieldChange={this.fieldChanged}
            onFieldNeedValidate={this.fieldValidate}
            errors={[...(errors || []), ...(this.serverErrors || []), ...(this.errors || [])]}
            warnings={this.warnings}
            readonly={readonly}
            labelInField={labelInField}
          />
        )}
        <FormErrors
          warnings={this.hiddenFieldsWarnings}
          errors={[...this.hiddenFieldsErrors, ...this.generalServerErrors]}
        />
        {actions && <FormActions>{actions}</FormActions>}
      </form>
    );
  }

  @computed
  get schema(): Schema | SimpleSchema | undefined {
    const { schema } = this.props;

    if (schema) {
      return computeDynamicProperties(this.value, schema);
    }
  }

  @boundMethod
  private handleChange(changedValue: Partial<T>) {
    const { onFormChange, auto, schema } = this.props;

    if (!schema) {
      return;
    }

    const value = calculateValues(changedValue, schema.properties);

    if (auto) {
      this.setValue(value);
    }

    if (onFormChange) {
      onFormChange(value);
    }
  }

  @boundMethod
  private async handleSubmit(e: React.FormEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();

    const { onFormSubmit, value, auto, actionFunction, onActionError } = this.props;
    if (onFormSubmit) {
      onFormSubmit(auto ? (this.value as T) : (value as T));
    }

    if (auto && actionFunction) {
      const errors = this.validate();
      this.processHiddenFieldErrors(errors);
      this.processHiddenFieldWarnings(this.warnings || []);

      if (this.shouldStopOnValidationErrors(errors, onActionError)) {
        return;
      }

      if (!(await this.confirmWarningsBeforeAction())) {
        return;
      }

      await this.doAction();
    }
  }

  private processHiddenFieldErrors(errors: FieldErrors[]): void {
    const hiddenErrors = errors
      .map(error => {
        if (error.hidden) {
          return `Поле ${error.title}: ${error.messages?.join(error.messages.length > 1 ? ', ' : '')}`;
        }
      })
      .filter(notFalsyFilter);

    if (!hiddenErrors.length) {
      return;
    }

    hiddenErrors.forEach(hiddenError => {
      services.logger.error('Ошибка в скрытом поле: ' + hiddenError);
    });

    this.setHiddenFieldsErrors([
      hiddenErrors.length > 1 ? 'Ошибка в полях формы.' : 'Ошибка в поле формы.',
      ...hiddenErrors
    ]);
  }

  private processHiddenFieldWarnings(warnings: FieldErrors[]): void {
    const hiddenWarnings = warnings
      .map(warning => {
        if (warning.hidden) {
          return `Поле ${warning.title}: ${warning.messages?.join(warning.messages.length > 1 ? ', ' : '')}`;
        }
      })
      .filter(notFalsyFilter);

    if (!hiddenWarnings.length) {
      return;
    }

    hiddenWarnings.forEach(hiddenWarning => {
      services.logger.warn('Предупреждение в скрытом поле: ' + hiddenWarning);
    });

    this.setHiddenFieldsWarnings([
      hiddenWarnings.length > 1 ? 'Предупреждения в полях формы.' : 'Предупреждение в поле формы.',
      ...hiddenWarnings
    ]);
  }

  private shouldStopOnValidationErrors(errors: FieldErrors[], onActionError?: FormProps<T>['onActionError']): boolean {
    if (errors.length && onActionError) {
      onActionError({ errors });

      return true;
    }

    return errors.length > 0;
  }

  @boundMethod
  private async confirmWarningsBeforeAction(): Promise<boolean> {
    const { confirmOnWarnings, warningsConfirmOptions, onActionAborted } = this.props;
    const warnings = this.validateWarnings();

    if (!warnings.length || !confirmOnWarnings) {
      return true;
    }

    const confirmed = await doConfirm({
      message: 'Есть предупреждения. Продолжить?',
      okText: 'Продолжить',
      cancelText: 'Отмена',
      ...warningsConfirmOptions
    });

    if (!confirmed) {
      onActionAborted?.();

      return false;
    }

    return true;
  }

  @boundMethod
  private validate(): FieldErrors[] {
    const { schema } = this.props;

    if (!schema) {
      return [];
    }

    const errors = validateFormValue(this.value, this.schema?.properties || schema.properties);
    this.setErrors(errors);
    this.setWarnings(validateFormWarnings(this.value, this.schema?.properties || schema.properties));

    return errors;
  }

  @boundMethod
  private validateWarnings(): FieldErrors[] {
    const { schema } = this.props;

    if (!schema) {
      return [];
    }

    const warnings = validateFormWarnings(this.value, this.schema?.properties || schema.properties);
    this.setWarnings(warnings);

    return warnings;
  }

  private async doAction() {
    const { actionFunction, onActionSuccess, onActionError, schema } = this.props;
    if (!schema) {
      throw new Error('Не удалось отправить форму: нет схемы');
    }

    try {
      if (!this.value) {
        throw new Error('Не удалось отправить форму: нет значений');
      }
      if (!actionFunction) {
        throw new Error('Не удалось отправить форму: нет действия');
      }
      await actionFunction(cleanCalculatedValues<T>(this.value, schema.properties));
      if (onActionSuccess) {
        onActionSuccess(this.value as T);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ errors: Record<string, unknown>[]; message: string }>;
      let formErrors: FieldErrors[];
      if (error instanceof FormFieldErrorsError) {
        formErrors = error.fieldErrors;
      } else if (isArrayOf(error, isFieldErrors)) {
        formErrors = error;
      } else {
        formErrors = (error as AxiosError<{ errors?: FieldErrors[] }>)?.response?.data?.errors || [];
      }
      const fieldsErrors: FieldErrors[] = [];
      const generalErrors: string[] = [];

      if (formErrors?.length) {
        formErrors.forEach(err => {
          const field = schema.properties.find(property => property.name === err.field);

          if (field && !field.hidden) {
            fieldsErrors.push(err);
          }

          if (field?.hidden) {
            generalErrors.push(`${field.title}: ${err.messages?.join(err.messages.length > 1 ? ', ' : '')}`);
          }

          if (!field && err.messages) {
            generalErrors.push(...err.messages);
          }

          if (!field && err.message) {
            generalErrors.push(`Ошибка: ${err.field} — ${err.message}`);
          }
        });
      }

      if (!formErrors?.length) {
        if (axiosError.response?.data?.message) {
          generalErrors.push(axiosError.response.data.message);
        }

        if (!axiosError.response?.data?.message) {
          if (axiosError.message) {
            generalErrors.push(`Ошибка: ${axiosError.message}`);
          }

          if (!axiosError.message && axiosError.response?.status) {
            generalErrors.push(`Ошибка: ${axiosError.response?.status}`);
          }

          if (!axiosError.message && !axiosError.response?.status) {
            generalErrors.push('Ошибка сервера');
          }
        }
      }

      this.setGeneralServerErrors(generalErrors);
      this.setServerErrors(normalizeServerErrors(fieldsErrors));

      if (onActionError) {
        onActionError(error as AxiosError<{ errors?: FieldErrors[] }>);
      }
    }
  }

  @action.bound
  private setValue(value: Partial<T>) {
    this.value = value;
  }

  @action
  private setErrors(errors: FieldErrors[] = []) {
    this.errors = errors.filter(({ messages }) => messages?.length);
  }

  @action
  private setWarnings(warnings: FieldErrors[] = []) {
    this.warnings = warnings.filter(({ messages }) => messages?.length);
  }

  @action
  private setServerErrors(errors?: FieldErrors[]) {
    this.serverErrors = errors;
  }

  @action
  private setHiddenFieldsErrors(errors?: string[]) {
    this.hiddenFieldsErrors = errors || [];
  }

  @action
  private setHiddenFieldsWarnings(warnings?: string[]) {
    this.hiddenFieldsWarnings = warnings || [];
  }

  @action
  private setGeneralServerErrors(errors?: string[]) {
    this.generalServerErrors = errors || [];
  }

  @boundMethod
  private fieldChanged(value: T[keyof T], fieldName: string, prevValue?: T[keyof T]) {
    const { auto, onFieldChange } = this.props;

    if (auto) {
      this.setGeneralServerErrors();
      this.filterFieldErrors(fieldName);
      this.filterFieldWarnings(fieldName);
    }

    if (onFieldChange && this.value) {
      onFieldChange(value, fieldName, prevValue, this.value);
    }
  }

  @boundMethod
  private fieldValidate(value: T[keyof T], fieldName: string) {
    const { auto, schema, onFieldNeedValidate } = this.props;

    if (!schema) {
      throw new Error('Не удалось отправить форму: нет схемы');
    }
    const field = schema.properties?.find(({ name }) => name === fieldName);

    if (!field) {
      throw new Error('Ошибка: нет поля');
    }

    if (auto) {
      this.filterFieldErrors(fieldName);
      this.filterFieldWarnings(fieldName);
      this.setErrors([...(this.errors || []), validateFieldValue(value, field, this.value)]);
      this.setWarnings([...(this.warnings || []), validateFieldWarnings(value, field, this.value)]);
    }

    if (onFieldNeedValidate) {
      onFieldNeedValidate(value, fieldName);
    }
  }

  private filterFieldErrors(fieldName: string) {
    this.setErrors(this.errors?.filter(({ field }) => field !== fieldName));
    this.setServerErrors(this.serverErrors?.filter(({ field }) => field !== fieldName));
  }

  private filterFieldWarnings(fieldName: string) {
    this.setWarnings(this.warnings?.filter(({ field }) => field !== fieldName));
  }

  @boundMethod
  private reset() {
    this.setErrors();
    this.setWarnings();
    this.setServerErrors();
    this.setGeneralServerErrors();
    this.setValue(cloneDeep(this.props.value || {}));
  }
}
