import React, { Component, ReactNode } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { RegistryConsumer } from '@bem-react/di';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep, isEqual } from 'lodash';

import { Schema, SimpleSchema } from '../../services/data/schema/schema.models';
import { CommonDiRegistry } from '../../services/di-registry';
import { generateRandomId } from '../../services/util/randomId';
import { konfirmieren } from '../../services/utility-dialogs.service';
import { ActionsLeft } from '../ActionsLeft/ActionsLeft';
import { ActionsRight } from '../ActionsRight/ActionsRight';
import { Button, ButtonProps } from '../Button/Button';
import { FormProps } from '../Form/Form';
import { FormRole } from '../Form/Form.async';
import { getDefaultValues } from '../Form/Form.utils';

import '!style-loader!css-loader!sass-loader!./FormDialog.scss';

// избавиться от schemaId в задаче #2268
const validateExceptions = new Set(['role', 'schemaId']);

const cnFormDialog = cn('FormDialog');

export interface FormDialogProps<T> extends IClassNameProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  schema: Schema | SimpleSchema;
  value?: Partial<T>;
  open: boolean;
  unclosable?: boolean;
  disabled?: boolean;
  labelInField?: boolean;
  afterForm?: ReactNode;
  formRole?: FormRole;
  closeWithConfirm?: boolean;
  onClose(): void;
  onSuccess?(): void;
  onError?(): void;
  onFormChange?(changedValue: T): void;
  onFieldChange?(value: T[keyof T], propertyName: string, prevValue: T[keyof T], formValue: Partial<T>): void;
  additionalAction?: ReactNode;
  actionButtonProps?: Omit<ButtonProps, 'ref'>;
  actionFunction(value: T): Promise<void> | void;
  closeButtonProps?: ButtonProps;
  invoke?: FormProps<T>['invoke'];
}

@observer
export class FormDialog<T> extends Component<FormDialogProps<T>> {
  @observable private busy = false;
  private formInvoke: FormProps<T>['invoke'] = {};
  private initialFormValue: Partial<T> | undefined = {};
  private actualFormValue: Partial<T> = {};

  constructor(props: FormDialogProps<T>) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    const value = cloneDeep(this.props.value);

    this.initialFormValue = value;
  }

  componentDidUpdate() {
    const { invoke } = this.props;
    if (invoke) {
      invoke.reset = this.formInvoke?.reset;
      invoke.setValue = this.formInvoke?.setValue;
      invoke.validate = this.formInvoke?.validate;
    }
  }

  render() {
    const {
      title,
      subtitle,
      className,
      open,
      unclosable = false,
      disabled = false,
      schema,
      formRole,
      labelInField,
      value = getDefaultValues(schema.properties),
      additionalAction,
      afterForm,
      actionButtonProps = {},
      closeButtonProps,
      actionFunction,
      onFieldChange
    } = this.props;
    const htmlId = generateRandomId();

    return (
      <Dialog
        PaperProps={{ className: cnFormDialog(null, [className]) }}
        open={open}
        onClose={this.close}
        fullWidth
        maxWidth='md'
      >
        {title && <DialogTitle>{title}</DialogTitle>}
        {subtitle && <div className={cnFormDialog('Subtitle')}>{subtitle}</div>}
        <DialogContent className='scroll'>
          <RegistryConsumer id='common'>
            {({ Form }: CommonDiRegistry) => (
              <Form
                className={cnFormDialog('Form')}
                formRole={formRole}
                schema={schema}
                value={value}
                id={htmlId}
                labelInField={labelInField}
                auto
                onFormChange={this.handleFormChange}
                onFormSubmit={this.handleSubmit}
                onActionSuccess={this.handleSuccess}
                onActionError={this.handleError}
                onFieldChange={onFieldChange}
                actionFunction={actionFunction}
                invoke={this.formInvoke}
              />
            )}
          </RegistryConsumer>
          {afterForm}
        </DialogContent>
        <DialogActions>
          <ActionsLeft>{additionalAction}</ActionsLeft>
          <ActionsRight>
            <Button
              disabled={disabled}
              form={htmlId}
              color='primary'
              loading={this.busy}
              type='submit'
              {...actionButtonProps}
            >
              {actionButtonProps.children || 'Отправить'}
            </Button>
            {!unclosable && (
              <Button {...closeButtonProps} onClick={this.close}>
                {closeButtonProps?.children || 'Отмена'}
              </Button>
            )}
          </ActionsRight>
        </DialogActions>
      </Dialog>
    );
  }

  @boundMethod
  private handleSubmit() {
    this.setBusy(true);
  }

  @boundMethod
  private handleError() {
    const { onError } = this.props;
    this.setBusy(false);
    if (onError) {
      onError();
    }
  }

  @boundMethod
  private handleSuccess() {
    const { onSuccess } = this.props;
    this.setBusy(false);
    if (onSuccess) {
      onSuccess();
    }
    this.closeWithoutConfirm();
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }

  @boundMethod
  private async close() {
    if (this.props.unclosable) {
      return;
    }

    if (this.props.closeWithConfirm && !this.isValueNotChanged(this.initialFormValue, this.actualFormValue)) {
      const confirmed = await konfirmieren({
        message: 'Все несохраненные данные будут утеряны.',
        okText: 'Всё равно закрыть',
        cancelText: 'Не закрывать'
      });

      if (confirmed) {
        this.closeWithoutConfirm();
      }

      return;
    }

    this.closeWithoutConfirm();
  }

  @boundMethod
  private closeWithoutConfirm() {
    if (this.props.unclosable) {
      return;
    }

    const { onClose } = this.props;
    this.formInvoke?.reset?.();
    onClose();
  }

  @boundMethod
  private handleFormChange(changedValue: T): void {
    const { onFormChange } = this.props;

    this.actualFormValue = changedValue;

    onFormChange?.(changedValue);
  }

  private isValueNotChanged(
    initValue: Record<string, unknown> | undefined,
    actualValue: Record<string, unknown>
  ): boolean {
    const result = isEqual(initValue, actualValue);

    if (result) {
      return true;
    }
    const actualKeys = Object.keys(actualValue);

    if (!actualKeys.length) {
      return true;
    }

    const initialKeys = initValue && typeof initValue === 'object' ? Object.keys(initValue) : [];
    const actualValues = Object.values(actualValue);

    if (!initialKeys?.length && actualValues.every(item => item === undefined || item === null)) {
      return true;
    }

    return Object.entries(actualValue).every(([key, value]) => {
      const initialFieldValue = initValue?.[key];
      const defaultFormValue = getDefaultValues<Record<string, unknown>>(this.props.schema.properties);
      const property = this.props.schema.properties.find(({ name }) => name === key);

      if (this.isEmptyValue(value) && this.isEmptyValue(initialFieldValue)) {
        return true;
      }
      if (defaultFormValue[key] === value && this.isEmptyValue(initialFieldValue)) {
        return true;
      }
      if (Array.isArray(value) && Array.isArray(initialFieldValue)) {
        return isEqual(initialFieldValue, value);
      }
      if (property?.calculatedValueFormula || property?.calculatedValueWellKnownFormula) {
        return true;
      }
      if (validateExceptions.has(key)) {
        return true;
      }

      return initialFieldValue === value;
    });
  }

  private isEmptyValue(value: unknown): boolean {
    return value === undefined || value === null || (Array.isArray(value) && !value.length);
  }
}
