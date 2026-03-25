import { type ReactNode } from 'react';
import { type DialogProps } from '@mui/material';
import { v4 as uuid } from 'uuid';

import { type FormProps } from '../components/Form/Form';
import { type AnswerModalInfo, answerModalsStore } from '../stores/AnswerModals.store';
import { type AnswerModalCloseEventDetail, communicationService } from './communication.service';
import { type SimpleSchema } from './data/schema/schema.models';
import { sleep } from './util/sleep';

// диалог с сообщением, аналог alert
export async function doAlert({
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
  await doDialog({ id: uuid(), type: 'alert', title, message, okText, dialogProps });
}

// диалог с подтверждением, аналог confirm
export async function doConfirm({
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
  const { answer } = await doDialog({ id: uuid(), type: 'confirm', title, message, okText, cancelText });

  return Boolean(answer);
}

// диалог с полем ввода, аналог prompt (не реализован до конца)
export async function doPrompt({
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
  const { value } = await doDialog({ id: uuid(), type: 'prompt', title, message, defaultValue, multiline });

  return value ?? null;
}

// диалог с формой, prompt на стероидах
export async function doFormPrompt<T>({
  title,
  message,
  schema,
  formProps,
  submitProps,
  SubmitComponent,
  submitData
}: {
  title?: ReactNode;
  message?: ReactNode;
  schema?: SimpleSchema;
  formProps?: FormProps<T>;
  submitProps?: AnswerModalInfo['submitProps'];
  SubmitComponent?: AnswerModalInfo['SubmitComponent'];
  submitData?: AnswerModalInfo['submitData'];
}): Promise<{ formValue: T; extra?: Record<string, unknown> }> {
  const detail = await doDialog({
    id: uuid(),
    type: 'formPrompt',
    title,
    message,
    schema,
    formProps,
    submitProps,
    SubmitComponent,
    submitData
  });

  return {
    formValue: detail.formValue as T,
    ...(detail.extra !== undefined && { extra: detail.extra })
  };
}

function doDialog(dialogData: AnswerModalInfo) {
  answerModalsStore.openDialog(dialogData);

  return new Promise<AnswerModalCloseEventDetail>(resolve => {
    const handler = async ({ detail }: CustomEvent<AnswerModalCloseEventDetail>) => {
      if (detail.id === dialogData.id) {
        communicationService.answerModalClosed.off(handler);
        resolve(detail);
        answerModalsStore.closeDialog(dialogData);
        await sleep(500); // анимация закрытия диалога
        answerModalsStore.removeDialog(dialogData);
      }
    };

    communicationService.answerModalClosed.on(handler);
  });
}
