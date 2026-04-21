import { isArray } from '../../util/typeGuards/isArray';
import { isRecordStringUnknown } from '../../util/typeGuards/isRecordStringUnknown';

const BASE64_IMAGE_RE = /^data:image\/[^;]+;base64,/;

interface PreparedReportData {
  media: Record<string, string>;
  data: Record<string, unknown>;
}

function isBase64Image(value: unknown): value is string {
  return typeof value === 'string' && BASE64_IMAGE_RE.test(value);
}

function processValue(value: unknown, path: string, media: Record<string, string>): unknown {
  if (isBase64Image(value)) {
    const key = `{%${path}%}`;
    media[key] = value;

    return key;
  }

  if (isArray(value)) {
    return value.map((item, i) => processValue(item, `${path}.${i}`, media));
  }

  if (isRecordStringUnknown(value)) {
    const result: Record<string, unknown> = {};

    for (const [k, v] of Object.entries(value)) {
      result[k] = processValue(v, path ? `${path}.${k}` : k, media);
    }

    return result;
  }

  return value;
}

/**
 * Рекурсивно обходит `data`, извлекает base64-картинки в `media`
 * и заменяет их плейсхолдерами вида `{%path.to.field%}`.
 * Исходные данные не мутируют.
 */
export function prepareReportData(data: Record<string, unknown>): PreparedReportData {
  const media: Record<string, string> = {};
  const processed = processValue(data, '', media);

  if (!isRecordStringUnknown(processed)) {
    throw new Error('Непредвиденная ошибка подготовки данных отчёта');
  }

  return { data: processed, media };
}
