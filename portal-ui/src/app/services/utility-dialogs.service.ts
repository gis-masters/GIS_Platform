import { ReactNode } from 'react';
import { v4 as uuid } from 'uuid';

import { UtilityDialogInfo, utilityDialogsStore } from '../stores/UtilityDialogs.store';
import { UtilityDialogCloseEventDetail, communicationService } from './communication.service';
import { sleep } from './util/sleep';

// диалог с сообщением, аналог alert
export async function achtung({
  title,
  message,
  okText
}: {
  title?: ReactNode;
  message?: ReactNode;
  okText?: string;
}): Promise<void> {
  await doDialog({ id: uuid(), type: 'achtung', title, message, okText });
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
