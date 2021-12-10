import { CrgProject } from '../../services/crg/projects.models';
import { Dataset, DataTable } from '../../services/data.service';
import { XTableProps } from '../XTable/XTable';

export enum PermissionsListItemType {
  PROJECT,
  TABLE,
  DATASET
}

export interface PermissionsXTablePropsSet {
  [PermissionsListItemType.PROJECT]: XTableProps<CrgProject>;
  [PermissionsListItemType.TABLE]: XTableProps<DataTable>;
  [PermissionsListItemType.DATASET]: XTableProps<Dataset>;
}

export const baseXTablePropsSet: PermissionsXTablePropsSet = {
  [PermissionsListItemType.PROJECT]: {
    data: [],
    cols: [
      {
        title: 'Название',
        field: 'name',
        filterable: true,
        sortable: true,
        getIdBadge: ({ id }) => id
      }
    ],
    defaultSort: { field: 'createdAt', asc: false },
    secondarySortField: 'id'
  },
  [PermissionsListItemType.TABLE]: {
    data: [],
    cols: [
      {
        title: 'Название',
        field: 'title',
        filterable: true,
        sortable: true
      },
      {
        title: 'Идентификатор',
        field: 'identifier',
        filterable: true,
        sortable: true
      },
      {
        title: 'Набор данных',
        field: 'dataset',
        filterable: true,
        sortable: true
      },
      {
        title: 'Схема',
        field: 'schemaId',
        filterable: true,
        sortable: true
      }
    ],
    defaultSort: { field: 'createdAt', asc: false },
    secondarySortField: 'identifier'
  },
  [PermissionsListItemType.DATASET]: {
    data: [],
    cols: [
      {
        title: 'Название',
        field: 'title',
        filterable: true,
        sortable: true
      },
      {
        title: 'Идентификатор',
        field: 'identifier',
        filterable: true,
        sortable: true
      },
      {
        title: 'Таблиц',
        field: 'itemsCount',
        filterable: true,
        sortable: true
      }
    ],
    defaultSort: { field: 'createdAt', asc: false },
    secondarySortField: 'identifier'
  }
};
