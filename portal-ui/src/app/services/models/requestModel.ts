/**
 * An object used to get page information from the server
 */
export interface RequestModel {
  page?: Pageable;
  sort?: Sortable;
  filter?: any;
}


export interface Pageable {
  pageSize?: number;
  offset?: number;
  count?: number;
  limit?: number;
}

export interface Sortable {
  field?: string;
  order?: number;
}
