import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, type DialogProps, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../services/communication.service';
import { type AnswerModalInfo } from '../../stores/AnswerModals.store';
import { Button, type ButtonProps } from '../Button/Button';
import { AnswerModalContent } from './Content/AnswerModal-Content.composed';

const cnAnswerModal = cn('AnswerModal');

interface AnswerModalProps {
  info: AnswerModalInfo;
}

const defaultSubmitTexts: Record<AnswerModalInfo['type'], string> = {
  alert: 'Понятно',
  confirm: 'Да',
  prompt: 'OK',
  formPrompt: 'OK'
};

const defaultCancelTexts: Record<AnswerModalInfo['type'], string> = {
  alert: '',
  confirm: 'Нет',
  prompt: 'Отмена',
  formPrompt: 'Отмена'
};

@observer
export class AnswerModal extends Component<AnswerModalProps> {
  render() {
    const {
      id,
      title,
      type,
      okText,
      cancelText,
      message,
      open,
      submitProps: extraSubmitProps,
      SubmitComponent,
      submitData
    } = this.props.info;
    const formId = `AnswerModalForm_${id}`;
    const submitText = extraSubmitProps?.children ?? okText ?? defaultSubmitTexts[type];
    const submitProps: ButtonProps =
      type === 'prompt' || type === 'formPrompt'
        ? { form: formId, type: 'submit', ...extraSubmitProps }
        : { onClick: this.handleOk, ...extraSubmitProps };
    const baseDialogProps: Partial<DialogProps> = type === 'formPrompt' ? { fullWidth: true, maxWidth: 'md' } : {};

    return (
      <Dialog
        {...baseDialogProps}
        slotProps={{ paper: { className: cnAnswerModal({ type }) } }}
        open={Boolean(open)}
        onClose={this.handleClose}
        {...this.props.info.dialogProps}
      >
        {title && <DialogTitle className={cnAnswerModal('Title')}>{title}</DialogTitle>}
        {(message || type === 'prompt') && <AnswerModalContent info={this.props.info} type={type} formId={formId} />}
        <DialogActions className={cnAnswerModal('Actions')}>
          {SubmitComponent ? (
            <SubmitComponent formId={formId} submit={this.submitForm} submitData={submitData ?? {}} />
          ) : (
            <Button {...submitProps} color='primary' autoFocus={type !== 'prompt'}>
              {submitText}
            </Button>
          )}
          {type !== 'alert' && <Button onClick={this.handleClose}>{cancelText || defaultCancelTexts[type]}</Button>}
        </DialogActions>
      </Dialog>
    );
  }

  @boundMethod
  private submitForm() {
    const formId = `AnswerModalForm_${this.props.info.id}`;
    const form = document.querySelector<HTMLFormElement>(`#${formId}`);

    if (form) {
      form.requestSubmit();
    }
  }

  @boundMethod
  private handleOk() {
    const { id } = this.props.info;
    communicationService.answerModalClosed.emit({ id, answer: true });
  }

  @boundMethod
  private handleClose() {
    communicationService.answerModalClosed.emit({ id: this.props.info.id, answer: false });
  }
}
