import { isRecordStringUnknown } from '../../util/typeGuards/isRecordStringUnknown';
import { type FileInfo } from './files.models';

export function isFileInfo(obj: unknown): obj is FileInfo {
  return Boolean(
    isRecordStringUnknown(obj) &&
      obj.id &&
      typeof obj.id === 'string' &&
      obj.size &&
      typeof obj.size === 'number' &&
      obj.title &&
      typeof obj.title === 'string'
  );
}
