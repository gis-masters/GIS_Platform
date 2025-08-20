import { CrgLayer } from '../../gis/layers/layers.models';
import { CrgProject } from '../../gis/projects/projects.models';
import { isRecordStringUnknown } from '../../util/typeGuards/isRecordStringUnknown';

export interface FileInfo {
  id: string;
  title: string;
  size: number;
  path?: string;
  createdBy?: string;
  createdAt?: string;
  notLoaded?: boolean;
  signed?: boolean;
  contentType?: string;
  expired?: boolean;
  extension?: string;
  intents?: string;
  resourceQualifier?: Record<string, string | number>;
  resourceType?: string;
}

export interface FileConnection {
  layer?: CrgLayer;
  project: CrgProject;
}

export enum CompoundMainFiles {
  SHP = 'shp',
  TAB = 'tab',
  MID = 'mid'
}

export enum CompoundFileTypes {
  SHP = 'shp',
  SHX = 'shx',
  DBF = 'dbf',
  PRJ = 'prj',
  SBN = 'sbn',
  SBX = 'sbx',
  FBN = 'fbn',
  FBX = 'fbx',
  AIN = 'ain',
  IXS = 'ixs',
  MXS = 'mxs',
  ATX = 'atx',
  XML = 'xml',
  TAB = 'tab',
  DAT = 'dat',
  MAP = 'map',
  ID = 'id',
  IND = 'ind',
  MID = 'mid',
  MIF = 'mif'
}

export const allCompoundFilesTypes: CompoundFileTypes[] = [
  CompoundFileTypes.SHP,
  CompoundFileTypes.SHX,
  CompoundFileTypes.DBF,
  CompoundFileTypes.PRJ,
  CompoundFileTypes.SBN,
  CompoundFileTypes.SBX,
  CompoundFileTypes.FBN,
  CompoundFileTypes.FBX,
  CompoundFileTypes.AIN,
  CompoundFileTypes.IXS,
  CompoundFileTypes.MXS,
  CompoundFileTypes.ATX,
  CompoundFileTypes.XML,
  CompoundFileTypes.TAB,
  CompoundFileTypes.DAT,
  CompoundFileTypes.MAP,
  CompoundFileTypes.ID,
  CompoundFileTypes.IND,
  CompoundFileTypes.MID,
  CompoundFileTypes.MIF
];

export const allShapeFilesTypes: Partial<CompoundFileTypes>[] = [
  CompoundFileTypes.SHP,
  CompoundFileTypes.SHX,
  CompoundFileTypes.DBF,
  CompoundFileTypes.PRJ,
  CompoundFileTypes.SBN,
  CompoundFileTypes.SBX,
  CompoundFileTypes.FBN,
  CompoundFileTypes.FBX,
  CompoundFileTypes.AIN,
  CompoundFileTypes.IXS,
  CompoundFileTypes.MXS,
  CompoundFileTypes.ATX,
  CompoundFileTypes.XML
];

export const shapeRequiredFilesTypes: Partial<CompoundFileTypes>[] = [
  CompoundFileTypes.SHP,
  CompoundFileTypes.SHX,
  CompoundFileTypes.DBF,
  CompoundFileTypes.PRJ
];

export const optionalShapeFilesTypes: Partial<CompoundFileTypes>[] = [
  CompoundFileTypes.SBN,
  CompoundFileTypes.SBX,
  CompoundFileTypes.FBN,
  CompoundFileTypes.FBX,
  CompoundFileTypes.AIN,
  CompoundFileTypes.IXS,
  CompoundFileTypes.MXS,
  CompoundFileTypes.ATX,
  CompoundFileTypes.XML
];

export const allTabFilesTypes: Partial<CompoundFileTypes>[] = [
  CompoundFileTypes.TAB,
  CompoundFileTypes.DAT,
  CompoundFileTypes.MAP,
  CompoundFileTypes.ID,
  CompoundFileTypes.IND
];

export const tabRequiredFilesTypes: Partial<CompoundFileTypes>[] = [
  CompoundFileTypes.TAB,
  CompoundFileTypes.DAT,
  CompoundFileTypes.MAP,
  CompoundFileTypes.ID
];

export const optionalTabFilesTypes: Partial<CompoundFileTypes>[] = [CompoundFileTypes.IND];

export const midMifRequiredFilesTypes: Partial<CompoundFileTypes>[] = [CompoundFileTypes.MID, CompoundFileTypes.MIF];

export const compoundFileFullType: Record<string, string> = {
  shp: 'Shapefile',
  tab: 'MapInfo TAB',
  mid: 'MapInfo MID'
};

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

export function isFileInfoArray(values: unknown): values is FileInfo[] {
  if (!Array.isArray(values)) {
    return false;
  }

  for (const value of values) {
    if (!isFileInfo(value)) {
      return false;
    }
  }

  return true;
}
