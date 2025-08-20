import { WfsFeature } from '../../geoserver/wfs/wfs.models';
import { getLayerByFeatureInCurrentProject } from '../../gis/layers/layers.utils';
import { notFalsyFilter } from '../../util/NotFalsyFilter';
import { LibraryRecord } from '../library/library.models';
import {
  allCompoundFilesTypes,
  allShapeFilesTypes,
  allTabFilesTypes,
  CompoundFileTypes,
  FileInfo,
  isFileInfo,
  midMifRequiredFilesTypes,
  optionalShapeFilesTypes,
  optionalTabFilesTypes,
  shapeRequiredFilesTypes,
  tabRequiredFilesTypes
} from './files.models';

export function getFileExtension(name = ''): string {
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
  tif: ['tiff'],
  zip: ['zipx', 'z01', 'zx01']
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

export function isZipFile(file: File | FileInfo): boolean {
  const title = isFileInfo(file) ? file.title : file.name;

  return normalizeExtension(getFileExtension(title)) === 'zip';
}

export function isPdfFile(file: File | FileInfo): boolean {
  const title = isFileInfo(file) ? file.title : file.name;

  return normalizeExtension(getFileExtension(title)) === 'pdf';
}

export function isPreviewAllowed(file: File | FileInfo): boolean {
  const title = isFileInfo(file) ? file.title : file.name;

  const types = ['jpg', 'png', 'gif', 'webp', 'pdf'];

  return types.includes(normalizeExtension(getFileExtension(title)));
}

export function isImageFile(file: File | FileInfo): boolean {
  const title = isFileInfo(file) ? file.title : file.name;
  const types = ['jpg', 'png', 'gif', 'webp'];

  return types.includes(normalizeExtension(getFileExtension(title)));
}

export function isGmlFile(file: File | FileInfo): boolean {
  const title = isFileInfo(file) ? file.title : file.name;

  return normalizeExtension(getFileExtension(title)) === 'gml';
}

export function isMidMifFile(file: File | FileInfo): boolean {
  const title = isFileInfo(file) ? file.title : file.name;

  return normalizeExtension(getFileExtension(title)) === 'mid' || normalizeExtension(getFileExtension(title)) === 'mif';
}

export function isTabFile(file: File | FileInfo): boolean {
  const title = isFileInfo(file) ? file.title : file.name;

  return normalizeExtension(getFileExtension(title)) === 'tab';
}

export function isShpFile(file: File | FileInfo): boolean {
  const title = isFileInfo(file) ? file.title : file.name;

  return normalizeExtension(getFileExtension(title)) === 'shp';
}

export function isTifFile(file: File | FileInfo): boolean {
  const title = isFileInfo(file) ? file.title : file.name;

  return normalizeExtension(getFileExtension(title)) === 'tif';
}

export function isDxfFile(file: File | FileInfo): boolean {
  const title = isFileInfo(file) ? file.title : file.name;

  return normalizeExtension(getFileExtension(title)) === 'dxf';
}

export function isFileCanBePlaced(file: File | FileInfo): boolean {
  const title = isFileInfo(file) ? file.title : file.name;

  const ext = normalizeExtension(getFileExtension(title));

  return ext === 'dxf' || ext === 'shp' || ext === 'tab' || ext === 'mid' || ext === 'mif' || ext === 'tif';
}

export function getLibraryRecordFiles(libraryRecord: LibraryRecord): FileInfo[] {
  return Object.values(libraryRecord)
    .map(value => {
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value) as unknown;
        } catch {}
      }

      return value;
    })
    .filter(value => Array.isArray(value) && value.every(isFileInfo))
    .flat() as FileInfo[];
}

export function hasPhotoModeInFeatures(features: WfsFeature[]): boolean {
  return features.some(feature => {
    const photoMode = getLayerByFeatureInCurrentProject(feature)?.photoMode;
    if (!photoMode) {
      return false;
    }

    return !!features.flatMap(feature => getPhotoModeFeatureFiles(feature)).length;
  });
}

export function getPhotoModeFeatureFiles(feature: WfsFeature): FileInfo[] {
  const layer = getLayerByFeatureInCurrentProject(feature);
  if (!layer?.photoMode || typeof layer?.photoMode !== 'string') {
    return [];
  }

  try {
    const photoModeValues = JSON.parse(layer.photoMode) as string[];

    return photoModeValues
      .map(value => {
        if (feature.properties[value]) {
          return feature.properties[value];
        }
      })
      .flatMap(property => {
        if (typeof property === 'string') {
          try {
            return JSON.parse(property) as FileInfo[];
          } catch {
            // do nothing
          }
        } else if (Array.isArray(property)) {
          return property as FileInfo[];
        }
      })
      .filter(notFalsyFilter);
  } catch {
    // в данных может встречаться photoMode со значением в виде одиночной строки
    const property = feature.properties[layer?.photoMode];

    if (typeof property === 'string') {
      try {
        return JSON.parse(property) as FileInfo[];
      } catch {
        // do nothing
      }
    } else if (Array.isArray(property)) {
      return property as FileInfo[];
    }
  }

  return [];
}

export function getMissingCompoundFileTypes(files: FileInfo[]): CompoundFileTypes[] {
  const filesTypes = new Set(files.map(fileInfo => normalizeExtension(getFileExtension(fileInfo.title))));
  let missingTypes: CompoundFileTypes[] = [];
  const fileExtension = normalizeExtension(getFileExtension(files[0].title)) as CompoundFileTypes;

  if (shapeRequiredFilesTypes.includes(fileExtension)) {
    missingTypes = shapeRequiredFilesTypes
      .map(type => {
        if (!filesTypes.has(type)) {
          return type;
        }
      })
      .filter(notFalsyFilter);
  } else if (tabRequiredFilesTypes.includes(fileExtension)) {
    missingTypes = tabRequiredFilesTypes
      .map(type => {
        if (!filesTypes.has(type)) {
          return type;
        }
      })
      .filter(notFalsyFilter);
  } else if (midMifRequiredFilesTypes.includes(fileExtension)) {
    missingTypes = midMifRequiredFilesTypes
      .map(type => {
        if (!filesTypes.has(type)) {
          return type;
        }
      })
      .filter(notFalsyFilter);
  }

  return missingTypes;
}

export function isFilePartOfCompoundTypeFiles(file: FileInfo): boolean {
  return allCompoundFilesTypes.includes(normalizeExtension(getFileExtension(file.title)) as CompoundFileTypes);
}

export function isFilePartOfCompoundShapeTypeFile(file: FileInfo): boolean {
  return allShapeFilesTypes.includes(normalizeExtension(getFileExtension(file.title)) as CompoundFileTypes);
}

export function isFilePartOfOptionalCompoundShapeTypeFile(file: FileInfo): boolean {
  return optionalShapeFilesTypes.includes(normalizeExtension(getFileExtension(file.title)) as CompoundFileTypes);
}

export function getCompoundShapeTypeFiles(file: FileInfo, files: FileInfo[]): FileInfo[] {
  const allCompoundFiles = files.filter(item => {
    if (getFileBaseName(item.title) === getFileBaseName(file.title) && isFilePartOfCompoundShapeTypeFile(item)) {
      return item;
    }
  });

  return getUniqueFiles(allCompoundFiles);
}

export function isFilePartOfCompoundTabTypeFile(file: FileInfo): boolean {
  return allTabFilesTypes.includes(normalizeExtension(getFileExtension(file.title)) as CompoundFileTypes);
}

export function isFilePartOfOptionalCompoundTabTypeFile(file: FileInfo): boolean {
  return optionalTabFilesTypes.includes(normalizeExtension(getFileExtension(file.title)) as CompoundFileTypes);
}

export function getCompoundTabTypeFiles(file: FileInfo, files: FileInfo[]): FileInfo[] {
  const allCompoundFiles = files.filter(item => {
    if (getFileBaseName(item.title) === getFileBaseName(file.title) && isFilePartOfCompoundTabTypeFile(item)) {
      return item;
    }
  });

  return getUniqueFiles(allCompoundFiles);
}

export function isFilePartOfCompoundMidTypeFile(file: FileInfo): boolean {
  return midMifRequiredFilesTypes.includes(normalizeExtension(getFileExtension(file.title)) as CompoundFileTypes);
}

export function getCompoundMidTypeFiles(file: FileInfo, files: FileInfo[]): FileInfo[] {
  return files.filter(item => {
    if (getFileBaseName(item.title) === getFileBaseName(file.title) && isFilePartOfCompoundMidTypeFile(item)) {
      return item;
    }
  });
}

function getUniqueFiles(arr: FileInfo[]): FileInfo[] {
  let i = 0;
  let current: FileInfo;
  const length = arr.length;
  const unique: FileInfo[] = [];

  for (; i < length; i++) {
    current = arr[i];
    if (!unique.some(item => item.title === current.title)) {
      unique.push(current);
    }
  }

  return unique;
}
