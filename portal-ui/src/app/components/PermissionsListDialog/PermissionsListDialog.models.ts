import { Dataset, VectorTable } from '../../services/data/vectorData/vectorData.models';
import { CrgProject } from '../../services/gis/projects/projects.models';
import { XTableProps } from '../XTable/XTable';

export enum PermissionsListItemType {
  PROJECT,
  TABLE,
  DATASET
}

export interface PermissionsXTablePropsSet {
  [PermissionsListItemType.PROJECT]: XTableProps<CrgProject>;
  [PermissionsListItemType.TABLE]: XTableProps<VectorTable>;
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
