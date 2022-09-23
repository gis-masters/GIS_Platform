import { FileInfo } from './files.service';
import { LibraryRecord } from './doc-library.service';
import { applyContentType } from './schema.utils';
import { schemaService } from './schema.service';
import { PropertyType } from './schema.models';

export function getFileExtension(name: string): string {
  const pos = name.lastIndexOf('.');
  const ext = name === '' || pos < 1 ? '' : name.slice(pos + 1);

  // если расширение слишком длинное, то считаем, что это не расширение, а просто точка посреди имени
  return ext.length < 10 ? ext : '';
}

export function getFileBaseName(name: string): string {
  const ext = getFileExtension(name);

  return ext ? name.slice(0, name.lastIndexOf(ext) - 1) : name;
}

const extensionsAliases = {
  jpg: ['jpeg', 'jpe', 'jfif'],
  tif: ['tiff']
};

export function normalizeExtension(ext: string): string {
  ext = ext.toLocaleLowerCase();

  for (const [key, val] of Object.entries(extensionsAliases)) {
    if (val.includes(ext)) {
      return key;
    }
  }

  return ext;
}

export function getReadableFileSize(bytes: number): string {
  if (Math.abs(bytes) < 1024) {
    return `${bytes} байт`;
  }

  const units = ['КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ', 'ЭБ', 'ЗБ', 'ЙБ'];
  let u = -1;
  const r = 10 ** 1;

  do {
    bytes /= 1024;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= 1024 && u < units.length - 1);

  return `${bytes.toFixed(bytes % 1 > 0.1 ? 1 : 0)} ${units[u]}`;
}

export function isTifFile(file: FileInfo): boolean {
  return normalizeExtension(getFileExtension(file.title)) === 'tif';
}

export function isPdfFile(file: FileInfo): boolean {
  return normalizeExtension(getFileExtension(file.title)) === 'pdf';
}

export function isPreviewAllowed(file: FileInfo): boolean {
  const types = ['jpg', 'png', 'gif', 'webp', 'pdf'];

  return types.includes(normalizeExtension(getFileExtension(file.title)));
}

export function isGmlFile(file: FileInfo): boolean {
  return normalizeExtension(getFileExtension(file.title)) === 'gml';
}

export function isDxfFile(file: FileInfo): boolean {
  return normalizeExtension(getFileExtension(file.title)) === 'dxf';
}

export async function getDocumentsFiles(libraryRecord: LibraryRecord): Promise<FileInfo[]> {
  const files: FileInfo[] = [];

  const schema = applyContentType(await schemaService.getSchema(libraryRecord.schemaId), libraryRecord.content_type_id);

  schema.properties.forEach(property => {
    if (property.propertyType === PropertyType.FILE) {
      (libraryRecord[property.name] as FileInfo[])?.forEach(file => {
        files.push(file);
      });
    }
  });

  return files;
}
