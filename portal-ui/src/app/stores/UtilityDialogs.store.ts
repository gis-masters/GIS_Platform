import { Component, ReactNode } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { DialogProps } from '@mui/material';

import { FormProps } from '../components/Form/Form';
import { SimpleSchema } from '../services/data/schema/schema.models';

export interface UtilityDialogInfo {
  id: string;
  title: ReactNode;
  message?: ReactNode;
  multiline?: boolean;
  type: 'achtung' | 'konfirmieren' | 'prompto' | 'formPrompt';
  defaultValue?: string;
  open?: boolean;
  okText?: string;
  cancelText?: string;
  schema?: SimpleSchema;
  formProps?: Partial<FormProps<unknown>>;
  dialogProps?: Partial<DialogProps>;
}

class UtilityDialogsStore {
  private static _instance: UtilityDialogsStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable dialogs: UtilityDialogInfo[] = [];
  root?: Component; // Оно тут точно надо?

  private constructor() {
    makeObservable(this);
  }

  @action
  openDialog(dialog: UtilityDialogInfo) {
    this.dialogs.push({ ...dialog, open: true });
  }

  @action
  closeDialog(dialog: UtilityDialogInfo) {
    const dialogToClose = this.dialogs.find(d => d.id === dialog.id);

    if (!dialogToClose) {
      throw new Error(`Диалог с id ${dialog.id} не найден`);
    }

    dialogToClose.open = false;
  }

  @action
  removeDialog(dialog: UtilityDialogInfo) {
    this.dialogs.splice(this.dialogs.indexOf(dialog), 1);
  }
}

export const utilityDialogsStore = UtilityDialogsStore.instance;
