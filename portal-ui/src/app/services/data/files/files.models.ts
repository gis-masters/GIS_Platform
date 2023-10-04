import { CrgLayer } from '../../gis/layers/layers.models';
import { CrgProject } from '../../gis/projects/projects.models';

export interface FileInfo {
  id: string;
  title: string;
  size: number;
  path?: string;
  createdBy?: string;
  createdAt?: string;
  notLoaded?: boolean;
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

export enum FileType {
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

export const allShapeFilesTypes: Partial<FileType>[] = [
  FileType.SHP,
  FileType.SHX,
  FileType.DBF,
  FileType.PRJ,
  FileType.SBN,
  FileType.SBX,
  FileType.FBN,
  FileType.FBX,
  FileType.AIN,
  FileType.IXS,
  FileType.MXS,
  FileType.ATX,
  FileType.XML
];

export const shapeRequiredFilesTypes: Partial<FileType>[] = [FileType.SHP, FileType.SHX, FileType.DBF, FileType.PRJ];

export const optionalShapeFilesTypes: Partial<FileType>[] = [
  FileType.SBN,
  FileType.SBX,
  FileType.FBN,
  FileType.FBX,
  FileType.AIN,
  FileType.IXS,
  FileType.MXS,
  FileType.ATX,
  FileType.XML
];

export const allTabFilesTypes: Partial<FileType>[] = [
  FileType.TAB,
  FileType.DAT,
  FileType.MAP,
  FileType.ID,
  FileType.IND
];

export const tabRequiredFilesTypes: Partial<FileType>[] = [FileType.TAB, FileType.DAT, FileType.MAP, FileType.ID];

export const optionalTabFilesTypes: Partial<FileType>[] = [FileType.IND];

export const midMifRequiredFilesTypes: Partial<FileType>[] = [FileType.MID, FileType.MIF];

export const compoundFileFullType: Record<string, string> = {
  shp: 'Shapefile',
  tab: 'MapInfo TAB',
  mid: 'MapInfo MID'
};
