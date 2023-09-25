import { action, makeObservable, observable } from 'mobx';
import { Component, ReactNode } from 'react';

export interface UtilityDialogInfo {
  id: string;
  title: ReactNode;
  message?: ReactNode;
  multiline?: boolean;
  type: 'achtung' | 'konfirmieren' | 'prompto';
  defaultValue?: string;
  open?: boolean;
  okText?: string;
  cancelText?: string;
}

class UtilityDialogsStore {
  @observable dialogs: UtilityDialogInfo[] = [];
  root?: Component;

  private static _instance: UtilityDialogsStore;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

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
