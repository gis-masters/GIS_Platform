import { isAxiosError } from 'axios';
import { saveAs } from 'file-saver';

import { Toast } from '../../components/Toast/Toast';
import { http } from '../api/http.service';
import { flags } from '../common/feature-flags/feature-flags.service';
import { isArray } from './typeGuards/isArray';
import { isRecordStringUnknown } from './typeGuards/isRecordStringUnknown';

export function saveAsCsv(filename: string, data: string): void {
  saveAsBlob(
    filename,
    new Blob(
      [
        new Uint8Array([0xef, 0xbb, 0xbf]), // UTF-8 BOM
        data
      ],
      { type: 'text/plain;charset=utf-8' }
    )
  );
}

export function saveAsBlob(filename: string, data: Blob | string): void {
  saveAs(data, filename, { autoBom: false });
}

function isAngularDevServerPort4200(): boolean {
  return typeof window !== 'undefined' && window.location.port === '4200';
}

function openFileDownloadInSameTab(): boolean {
  return Boolean(flags.openFileDownloadInSameTab);
}

function clickTemporaryLink(href: string, filename: string): void {
  const link = document.createElement('a');
  link.href = href;
  link.rel = 'noopener noreferrer';

  if (!openFileDownloadInSameTab()) {
    link.download = filename;
    link.target = '_blank';
  }

  document.body.append(link);
  link.click();
  link.remove();
}

function downloadByUrlNative(url: string, filename: string): void {
  clickTemporaryLink(url, filename);
}

function messageFromServerPayload(j: Record<string, unknown>): string | undefined {
  const msg = j.message;
  if (typeof msg === 'string') {
    return msg;
  }
  if (isArray(msg)) {
    return msg.map(String).join(', ');
  }
  const errField = j.error;
  if (typeof errField === 'string') {
    return errField;
  }

  return undefined;
}

async function extractMessageFromErrorBlob(blob: Blob, status: number): Promise<string> {
  const raw = await blob.text();
  const text = raw.trim();
  if (text.startsWith('{')) {
    try {
      const parsed: unknown = JSON.parse(text);
      if (isRecordStringUnknown(parsed)) {
        const fromJson = messageFromServerPayload(parsed);
        if (fromJson) {
          return fromJson;
        }
      }
    } catch {
      /* текст ответа ниже */
    }
  }

  return text.slice(0, 800) || `Ошибка ${status}`;
}

async function extractDownloadErrorMessage(error: unknown): Promise<string> {
  if (!isAxiosError<unknown>(error)) {
    return error instanceof Error ? error.message : 'Неизвестная ошибка';
  }

  if (!error.response) {
    return error.message || 'Сеть недоступна';
  }

  const status = error.response.status;
  const data = error.response.data;

  if (data instanceof Blob) {
    return extractMessageFromErrorBlob(data, status);
  }

  if (isRecordStringUnknown(data)) {
    const fromObj = messageFromServerPayload(data);
    if (fromObj) {
      return fromObj;
    }
  }

  if (typeof data === 'string') {
    return data.slice(0, 800);
  }

  return `Ошибка загрузки файла (${status})`;
}

/**
 * Скачивание через http + blob: на :4200 (прокси/CORS) и при открытии в той же вкладке (e2e).
 * Ошибки ответа видны в Toast.
 */
async function downloadByUrlViaHttp(url: string, filename: string): Promise<void> {
  let blob: Blob;
  try {
    blob = await http.get<Blob>(url, {
      responseType: 'blob',
      cache: { disabled: true }
    });
  } catch (error) {
    const details = await extractDownloadErrorMessage(error);
    Toast.error({ message: 'Не удалось скачать файл', details });
    throw error;
  }

  const objectUrl = URL.createObjectURL(blob);

  if (openFileDownloadInSameTab()) {
    window.location.assign(objectUrl);
  } else {
    clickTemporaryLink(objectUrl, filename);
  }

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 60_000);
}

/**
 * Перед переходом по ссылке: лёгкий HEAD (без тела файла). Если сервер отвечает ошибкой — Toast.
 * Не гарантирует совпадение с GET; при 405/501 считаем, что HEAD не поддерживается, и всё равно кликаем.
 */
async function warnIfHeadIndicatesDownloadError(url: string): Promise<void> {
  let status: number;
  try {
    const res = await http.axios.head(url, { validateStatus: () => true });
    status = res.status;
  } catch {
    return;
  }

  if (status === 405 || status === 501) {
    return;
  }

  if (status >= 400) {
    Toast.error({
      message: 'Не удалось скачать файл',
      details: `Сервер ответил ${String(status)} (проверка перед загрузкой).`
    });
    throw new Error('Сервер отклонил загрузку');
  }
}

export async function downloadByUrl(url: string, filename: string): Promise<void> {
  if (isAngularDevServerPort4200() || openFileDownloadInSameTab()) {
    await downloadByUrlViaHttp(url, filename);

    return;
  }

  await warnIfHeadIndicatesDownloadError(url);
  downloadByUrlNative(url, filename);
}
