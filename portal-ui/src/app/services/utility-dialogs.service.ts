import { ReactNode } from 'react';
import { DialogProps } from '@mui/material';
import { v4 as uuid } from 'uuid';

import { FormProps } from '../components/Form/Form';
import { UtilityDialogInfo, utilityDialogsStore } from '../stores/UtilityDialogs.store';
import { communicationService, UtilityDialogCloseEventDetail } from './communication.service';
import { SimpleSchema } from './data/schema/schema.models';
import { sleep } from './util/sleep';

// диалог с сообщением, аналог alert
export async function achtung({
  title,
  message,
  okText,
  dialogProps
}: {
  title?: ReactNode;
  message?: ReactNode;
  okText?: string;
  dialogProps?: Partial<DialogProps>;
}): Promise<void> {
  await doDialog({ id: uuid(), type: 'achtung', title, message, okText, dialogProps });
}

// диалог с подтверждением, аналог confirm
export async function konfirmieren({
  title,
  message,
  okText,
  cancelText
}: {
  title?: ReactNode;
  message?: ReactNode;
  okText?: string;
  cancelText?: string;
}): Promise<boolean> {
  const { answer } = await doDialog({ id: uuid(), type: 'konfirmieren', title, message, okText, cancelText });

  return Boolean(answer);
}

// диалог с полем ввода, аналог prompt (не реализован до конца)
export async function prompto({
  title,
  message,
  defaultValue,
  multiline
}: {
  title?: ReactNode;
  message?: ReactNode;
  defaultValue?: string;
  multiline?: boolean;
}): Promise<string | null> {
  const { value } = await doDialog({ id: uuid(), type: 'prompto', title, message, defaultValue, multiline });

  return value ?? null;
}

// диалог с формой, prompt на стероидах
export async function formPrompt<T>({
  title,
  message,
  schema,
  formProps
}: {
  title?: ReactNode;
  message?: ReactNode;
  schema?: SimpleSchema;
  formProps?: FormProps<T>;
}): Promise<T> {
  const { formValue } = await doDialog({ id: uuid(), type: 'formPrompt', title, message, schema, formProps });

  return formValue as T;
}

function doDialog(dialogData: UtilityDialogInfo) {
  utilityDialogsStore.openDialog(dialogData);

  return new Promise<UtilityDialogCloseEventDetail>(resolve => {
    const handler = async ({ detail }: CustomEvent<UtilityDialogCloseEventDetail>) => {
      if (detail.id === dialogData.id) {
        communicationService.utilityDialogClosed.off(handler);
        resolve(detail);
        utilityDialogsStore.closeDialog(dialogData);
        await sleep(500); // анимация закрытия диалога
        utilityDialogsStore.removeDialog(dialogData);
      }
    };

    communicationService.utilityDialogClosed.on(handler);
  });
}
