import { saveAs } from 'file-saver';

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
