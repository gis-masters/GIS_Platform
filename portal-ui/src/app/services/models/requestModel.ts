import {SimpleProperty} from '../crg/data-schema.service';
import {ProcessStatus} from '../process-status';
import {WsMessageType} from '../ws.service';

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

export interface ProcessResponse {
  id: number;
  userName: string;
  title: string;
  status: ProcessStatus;
  type: WsMessageType;
  extra: any;
  details: any;
}
