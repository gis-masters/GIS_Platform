import { FtsRequestDto, FtsResponseDto } from '../../../../server-types/common-contracts';
import { WfsFeature } from '../../geoserver/wfs/wfs.models';
import { LibraryRecord } from '../library/library.models';

export interface SearchRequest extends Partial<FtsRequestDto> {
  text: string;
}

interface SearchSourceForDocument {
  library: string;
  schema: string;
}

interface SearchSourceForFeature {
  dataset: string;
  table: string;
}

interface SearchItemDataTypeFeature extends FtsResponseDto {
  type: 'FEATURE';
  source: SearchSourceForFeature;
  payload: WfsFeature;
}

interface SearchItemDataTypeDocument extends FtsResponseDto {
  type: 'DOCUMENT';
  source: SearchSourceForDocument;
  payload: LibraryRecord;
}

export type SearchItemData = SearchItemDataTypeDocument | SearchItemDataTypeFeature;
