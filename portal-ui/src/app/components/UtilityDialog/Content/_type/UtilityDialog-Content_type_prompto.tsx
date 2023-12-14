import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { DialogContent, DialogContentText, TextField } from '@mui/material';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../../../services/communication.service';

import { UtilityDialogContentProps, cnUtilityDialogContent } from '../UtilityDialog-Content.base';

@observer
class UtilityDialogContentTypePrompto extends Component<UtilityDialogContentProps> {
  @observable private text?: string;

  constructor(props: UtilityDialogContentProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { info, formId, className } = this.props;
    const { message, multiline, defaultValue } = info;

    return (
      <DialogContent className={className}>
        <DialogContentText>{message}</DialogContentText>

        <form onSubmit={this.okHandler} id={formId}>
          <TextField
            fullWidth
            variant='standard'
            type='text'
            multiline={multiline}
            value={this.text ?? defaultValue}
            onChange={this.textChangeHandler}
            autoFocus
          />
        </form>
      </DialogContent>
    );
  }

  @boundMethod
  private okHandler(e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    const { id, defaultValue = '' } = this.props.info;
    communicationService.utilityDialogClosed.emit({ id, answer: true, value: this.text ?? defaultValue });
  }

  @action.bound
  private textChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    this.text = event.target.value;
  }
}

export const withTypePrompto = withBemMod<UtilityDialogContentProps, UtilityDialogContentProps>(
  cnUtilityDialogContent(),
  { type: 'prompto' },
  () => UtilityDialogContentTypePrompto
);
