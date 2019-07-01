import {SimpleProperty} from '../gis/fgistp-rules.service';

export interface RequestModel {
  page?: Pageable;
  sort?: Sortable;
  filter?: FilterEvent[];
}

export interface Pageable {
  pageSize?: number;
  offset?: number;
  count?: number;
  limit?: number;
}

export interface Sortable {
  column?: any;
  sorts?: any;
  newValue?: string;
  prevValue?: string;
}

export interface FilterEvent {
  property?: SimpleProperty;
  value?: string[];
}
