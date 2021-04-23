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
        filtering: true,
        sorting: true,
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
        filtering: true,
        sorting: true
      },
      {
        title: 'Идентификатор',
        field: 'identifier',
        filtering: true,
        sorting: true
      },
      {
        title: 'Набор данных',
        field: 'dataset',
        filtering: true,
        sorting: true
      },
      {
        title: 'Схема',
        field: 'schemaId',
        filtering: true,
        sorting: true
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
        filtering: true,
        sorting: true
      },
      {
        title: 'Идентификатор',
        field: 'identifier',
        filtering: true,
        sorting: true
      },
      {
        title: 'Таблиц',
        field: 'itemsCount',
        filtering: true,
        sorting: true
      }
    ],
    defaultSort: { field: 'createdAt', asc: false },
    secondarySortField: 'identifier'
  }
};
