import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { UtilityDialogInfo } from '../../stores/UtilityDialogs.store';
import { communicationService } from '../../services/communication.service';
import { Button } from '../Button/Button';

const cnUtilityDialog = cn('UtilityDialog');

interface UtilityDialogProps {
  info: UtilityDialogInfo;
}

const submitTexts: Record<UtilityDialogInfo['type'], string> = {
  achtung: 'Понятно',
  konfirmieren: 'Да',
  prompto: 'OK'
};

const cancelTexts: Record<UtilityDialogInfo['type'], string> = {
  achtung: '',
  konfirmieren: 'Нет',
  prompto: 'Отмена'
};

@observer
export class UtilityDialog extends Component<UtilityDialogProps> {
  @observable private text?: string;

  constructor(props: UtilityDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { title, type, okText, cancelText, defaultValue = '', multiline, message, open } = this.props.info;

    return (
      <Dialog PaperProps={{ className: cnUtilityDialog({ type }) }} open={Boolean(open)} onClose={this.closeHandler}>
        {title && <DialogTitle className={cnUtilityDialog('Title')}>{title}</DialogTitle>}
        {(message || type === 'prompto') && (
          <DialogContent>
            {message}
            {type === 'prompto' && (
              <form onSubmit={this.okHandler}>
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
            )}
          </DialogContent>
        )}
        <DialogActions className={cnUtilityDialog('Actions')}>
          <Button onClick={this.okHandler} color='primary' autoFocus={type !== 'prompto'}>
            {okText || submitTexts[type]}
          </Button>
          {type !== 'achtung' && <Button onClick={this.closeHandler}>{cancelText || cancelTexts[type]}</Button>}
        </DialogActions>
      </Dialog>
    );
  }

  @boundMethod
  private okHandler(e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    communicationService.utilityDialogClosed.emit({ id: this.props.info.id, answer: true, value: this.text });
  }

  @boundMethod
  private closeHandler() {
    communicationService.utilityDialogClosed.emit({ id: this.props.info.id, answer: false });
  }

  @action.bound
  private textChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    this.text = event.target.value;
  }
}
