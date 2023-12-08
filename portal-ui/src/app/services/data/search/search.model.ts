import { FtsRequestDto, FtsResponseDto } from '../../../../server-types/common-contracts';
import { GeometryType, WfsFeature } from '../../geoserver/wfs/wfs.models';
import { LibraryRecordRaw } from '../library/library.models';

export interface SearchRequest extends Partial<FtsRequestDto> {
  text: string;
}

interface SearchSourceForDocument {
  library: string;
  title: string;
  schema: string;
}

export interface SearchSourceForFeature {
  dataset: string;
  datasetTitle: string;
  schema: string;
  table: string;
  tableTitle: string;
  geometryType: GeometryType;
}

export interface SearchItemDataTypeFeature extends FtsResponseDto {
  type: 'FEATURE';
  source: SearchSourceForFeature;
  payload: WfsFeature;
}

export interface SearchRawItemDataTypeFeature extends FtsResponseDto {
  type: 'FEATURE';
  source: SearchSourceForFeature;
  payload: Record<string, unknown>;
}

interface SearchItemDataTypeDocument extends FtsResponseDto {
  type: 'DOCUMENT';
  source: SearchSourceForDocument;
  payload: LibraryRecordRaw;
}

export type SearchItemData = SearchItemDataTypeDocument | SearchItemDataTypeFeature;
export type SearchRawItemData = SearchItemDataTypeDocument | SearchRawItemDataTypeFeature;
