import React, { type ChangeEvent, Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { DialogContent, DialogContentText, TextField } from '@mui/material';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../../../services/communication.service';
import { type AnswerModalContentProps, cnAnswerModalContent } from '../AnswerModal-Content.base';

@observer
class AnswerModalContentTypePrompt extends Component<AnswerModalContentProps> {
  @observable private text?: string;

  constructor(props: AnswerModalContentProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { info, formId, className } = this.props;
    const { message, multiline, defaultValue } = info;

    return (
      <DialogContent className={className}>
        <DialogContentText>{message}</DialogContentText>

        <form onSubmit={this.handleOk} id={formId}>
          <TextField
            fullWidth
            variant='standard'
            type='text'
            multiline={multiline}
            value={this.text ?? defaultValue}
            onChange={this.handleTextChange}
            autoFocus
          />
        </form>
      </DialogContent>
    );
  }

  @boundMethod
  private handleOk(e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    const { id, defaultValue = '' } = this.props.info;
    communicationService.answerModalClosed.emit({ id, answer: true, value: this.text ?? defaultValue });
  }

  @action.bound
  private handleTextChange(event: ChangeEvent<HTMLInputElement>) {
    this.text = event.target.value;
  }
}

export const withTypePrompt = withBemMod<AnswerModalContentProps, AnswerModalContentProps>(
  cnAnswerModalContent(),
  { type: 'prompt' },
  () => AnswerModalContentTypePrompt
);
