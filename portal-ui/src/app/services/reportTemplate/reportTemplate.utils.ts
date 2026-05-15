function decodeRFC5987(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function stripOuterDoubleQuotes(value: string): string {
  if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
    return value.slice(1, -1);
  }

  return value;
}

/** Извлекает имя файла из заголовка Content-Disposition (filename / filename*). */
export function parseContentDispositionFilename(header: string | undefined): string | undefined {
  if (!header?.trim()) {
    return undefined;
  }

  const starMatch = /filename\*=UTF-8''([^;\s]+)/iu.exec(header);
  if (starMatch?.[1]) {
    return decodeRFC5987(stripOuterDoubleQuotes(starMatch[1]));
  }

  const quotedMatch = /filename="([^"]+)"/iu.exec(header);
  if (quotedMatch?.[1]) {
    return quotedMatch[1];
  }

  const plainMatch = /filename=([^;\s]+)/iu.exec(header);
  if (plainMatch?.[1]) {
    return stripOuterDoubleQuotes(plainMatch[1]);
  }

  return undefined;
}

const MIME_TO_FILE_EXTENSION: Record<string, string> = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.oasis.opendocument.text': '.odt',
  'application/vnd.oasis.opendocument.spreadsheet': '.ods',
  'application/zip': '.zip'
};

/** Имя файла без каталогов, без path traversal. */
export function sanitizeDownloadBasename(raw: string): string {
  const tail = raw.replace(/^.*[/\\]/u, '').trim();

  return tail.replaceAll('..', '') || 'template';
}

/** Имя для повторной отправки multipart, если сервер не дал Content-Disposition. */
export function fallbackReportTemplateFilename(blob: Blob, templateSlug: string): string {
  const ext = blob.type ? MIME_TO_FILE_EXTENSION[blob.type] : undefined;

  if (ext) {
    return `${templateSlug}${ext}`;
  }

  return templateSlug;
}
