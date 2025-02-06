import { ReactNode } from 'react';

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

export interface SearchSourcesForFeature {
  dataset: string;
  table: string;
}

export interface SearchSourcesForDocument {
  library: string;
}

export interface SearchItemDataTypeFeature extends FtsResponseDto {
  type: 'FEATURE';
  source: SearchSourceForFeature;
  payload: WfsFeature;
  headlines: string[];
}

interface SearchItemDataTypeDocument extends FtsResponseDto {
  type: 'DOCUMENT';
  source: SearchSourceForDocument;
  payload: LibraryRecordRaw;
  headlines: string[];
}

export interface FoundFeature {
  feature: WfsFeature;
  searchResultHighlight: ReactNode;
}

export type SearchItemData = SearchItemDataTypeDocument | SearchItemDataTypeFeature;
export type SearchItemDataSource = SearchSourcesForFeature | SearchSourcesForDocument;
