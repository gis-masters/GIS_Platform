import { type Component, type FC, type ReactNode } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { type DialogProps } from '@mui/material';

import { type ButtonProps } from '../components/Button/Button';
import { type FormProps } from '../components/Form/Form';
import { type SimpleSchema } from '../services/data/schema/schema.models';

export interface SubmitComponentProps {
  formId: string;
  submit(): void;
  submitData: Record<string, unknown>;
}

export interface AnswerModalInfo {
  id: string;
  title: ReactNode;
  message?: ReactNode;
  multiline?: boolean;
  type: 'alert' | 'confirm' | 'prompt' | 'formPrompt';
  defaultValue?: string;
  open?: boolean;
  okText?: string;
  cancelText?: string;
  submitProps?: Partial<ButtonProps>;
  SubmitComponent?: FC<SubmitComponentProps>;
  submitData?: Record<string, unknown>;
  schema?: SimpleSchema;
  formProps?: Partial<FormProps<unknown>>;
  dialogProps?: Partial<DialogProps>;
}

class AnswerModalsStore {
  private static _instance: AnswerModalsStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable dialogs: AnswerModalInfo[] = [];
  root?: Component; // Оно тут точно надо?

  private constructor() {
    makeObservable(this);
  }

  @action
  openDialog(dialog: AnswerModalInfo) {
    this.dialogs.push({ ...dialog, open: true });
  }

  @action
  closeDialog(dialog: AnswerModalInfo) {
    const dialogToClose = this.dialogs.find(d => d.id === dialog.id);

    if (!dialogToClose) {
      throw new Error(`Диалог с id ${dialog.id} не найден`);
    }

    dialogToClose.open = false;
  }

  @action
  removeDialog(dialog: AnswerModalInfo) {
    this.dialogs.splice(this.dialogs.indexOf(dialog), 1);
  }
}

export const answerModalsStore = AnswerModalsStore.instance;
