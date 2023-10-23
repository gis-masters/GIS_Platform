import React, { Component, ReactNode } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { RegistryConsumer } from '@bem-react/di';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { generateRandomId } from '../../services/util/randomId';
import { CommonDiRegistry } from '../../services/di-registry';
import { Schema, SimpleSchema } from '../../services/data/schema/schema.models';
import { getDefaultValues } from '../Form/Form.utils';
import { ActionsRight } from '../ActionsRight/ActionsRight';
import { ActionsLeft } from '../ActionsLeft/ActionsLeft';
import { Button, ButtonProps } from '../Button/Button';
import { FormRole } from '../Form/Form.async';
import { FormProps } from '../Form/Form';

const cnFormDialog = cn('FormDialog');

export interface FormDialogProps<T> extends IClassNameProps {
  title?: ReactNode;
  schema: Schema | SimpleSchema;
  value?: Partial<T>;
  open: boolean;
  unclosable?: boolean;
  afterForm?: ReactNode;
  formRole?: FormRole;
  onClose(): void;
  onSuccess?(): void;
  onError?(): void;
  onFormChange?(changedValue: T): void;
  additionalAction?: ReactNode;
  actionButtonProps?: Omit<ButtonProps, 'ref'>;
  actionFunction: (value: T) => Promise<void> | void;
  invoke?: FormProps<T>['invoke'];
}

@observer
export class FormDialog<T> extends Component<FormDialogProps<T>> {
  @observable private busy = false;
  private formInvoke: FormProps<T>['invoke'] = {};

  constructor(props: FormDialogProps<T>) {
    super(props);
    makeObservable(this);
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
      className,
      open,
      unclosable = false,
      schema,
      formRole,
      value = getDefaultValues(schema.properties),
      additionalAction,
      afterForm,
      actionButtonProps = {},
      actionFunction,
      onFormChange
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
        <DialogContent className='scroll'>
          <RegistryConsumer id='common'>
            {({ Form }: CommonDiRegistry) => (
              <Form
                id={htmlId}
                className={cnFormDialog()}
                schema={schema}
                value={value}
                formRole={formRole}
                auto
                onFormSubmit={this.submitHandler}
                onFormChange={onFormChange}
                onActionSuccess={this.successHandler}
                onActionError={this.errorHandler}
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
            <Button form={htmlId} color='primary' loading={this.busy} type='submit' {...actionButtonProps}>
              {actionButtonProps.children || 'Отправить'}
            </Button>
            {!unclosable && <Button onClick={this.close}>Отмена</Button>}
          </ActionsRight>
        </DialogActions>
      </Dialog>
    );
  }

  @boundMethod
  private submitHandler() {
    this.setBusy(true);
  }

  @boundMethod
  private errorHandler() {
    const { onError } = this.props;
    this.setBusy(false);
    if (onError) {
      onError();
    }
  }

  @boundMethod
  private successHandler() {
    const { onSuccess } = this.props;
    this.setBusy(false);
    if (onSuccess) {
      onSuccess();
    }
    this.close();
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }

  @boundMethod
  private close() {
    if (this.props.unclosable) {
      return;
    }

    const { onClose } = this.props;
    this.formInvoke?.reset();
    onClose();
  }
}
