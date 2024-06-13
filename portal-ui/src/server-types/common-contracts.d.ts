export interface SpatialReferenceSystem {
  authName: string;
  authSrid: number;
  srtext: string;
  proj4Text: string;
}

export interface FtsRequestDto {
  text: string;
  ecqlFilter: string;
  type: FtsType;
  bound: number;
  sources: { [index: string]: any }[];
}

export interface FtsResponseDto {
  type: FtsType;
  value: number;
  source: { [index: string]: any };
  payload: any;
  headlines: string[];
}

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface PageableResources<T> {
  content: T[];
  page: Page;
}

export interface SpecializationView {
  id: number;
  title: string;
  description: string;
  tags: string[];
}

export type FtsType = 'DOCUMENT' | 'FEATURE';
