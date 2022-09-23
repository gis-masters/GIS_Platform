import React, { Component, ReactNode } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { RegistryConsumer } from '@bem-react/di';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { Schema } from '../../services/data/schema.models';
import { CommonDiRegistry } from '../../services/di-registry';
import { generateRandomId } from '../../services/util/randomId';
import { getDefaultValues } from '../../services/formValidation.service';
import { DialogActionsRight } from '../DialogActionsRight/DialogActionsRight';
import { DialogActionsLeft } from '../DialogActionsLeft/DialogActionsLeft';
import { Button, ButtonProps } from '../Button/Button';

const cnFormDialog = cn('FormDialog');

export interface FormDialogProps<T extends Record<string, unknown>> {
  title?: ReactNode;
  schema: Schema<T>;
  value?: Partial<T>;
  open: boolean;
  unclosable?: boolean;
  onClose(): void;
  onSuccess?(): void;
  onError?(): void;
  onFormChange?(changedValue: T): void;
  additionalAction?: ReactNode;
  actionButtonProps?: Omit<ButtonProps, 'ref'>;
  actionFunction: (value: T) => Promise<void> | void;
}

@observer
export class FormDialog<T extends Record<string, unknown> = Record<string, unknown>> extends Component<
  FormDialogProps<T>
> {
  @observable private busy = false;
  private formInvoke: { reset?(): void } = {};

  constructor(props: FormDialogProps<T>) {
    super(props);
    makeObservable(this);
  }

  render() {
    const {
      title,
      open,
      unclosable = false,
      schema,
      value = getDefaultValues(schema.properties),
      additionalAction,
      actionButtonProps = {},
      actionFunction,
      onFormChange
    } = this.props;
    const htmlId = generateRandomId();

    return (
      <Dialog PaperProps={{ className: cnFormDialog() }} open={open} onClose={this.close} fullWidth maxWidth='md'>
        {title && <DialogTitle>{title}</DialogTitle>}
        <DialogContent className='scroll'>
          <RegistryConsumer id='common'>
            {({ Form }: CommonDiRegistry) => (
              <Form
                id={htmlId}
                className={cnFormDialog()}
                schema={schema}
                value={value}
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
        </DialogContent>
        <DialogActions>
          <DialogActionsLeft>{additionalAction}</DialogActionsLeft>
          <DialogActionsRight>
            <Button form={htmlId} color='primary' loading={this.busy} type='submit' {...actionButtonProps}>
              {actionButtonProps.children || 'Отправить'}
            </Button>
            {!unclosable && <Button onClick={this.close}>Отмена</Button>}
          </DialogActionsRight>
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
