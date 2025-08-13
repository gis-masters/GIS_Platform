import { ComponentType, ReactNode } from 'react';
import { TableCellProps } from '@mui/material';

import {
  PropertySchemaChoice,
  PropertySchemaDatetime,
  PropertySchemaFloat,
  PropertySchemaString,
  PropertySchemaUrl,
  PropertyType,
  Relation
} from '../../services/data/schema/schema.models';
import { FilterQuery } from '../../services/util/filters/filters.models';
import { XTableCellContentProps } from './CellContent/XTable-CellContent.base';
import { XTableFilterProps } from './Filter/XTable-Filter.base';
import { XTableFilterPanelItemContentProps } from './FilterPanelItemContent/XTable-FilterPanelItemContent.base';

export enum XTableExtraColumnType {
  ID = 'id'
}

export type XTableColumnType = PropertyType | XTableExtraColumnType;

export interface XTableColumn<T> {
  field?: keyof T & string;
  title?: ReactNode;
  description?: ReactNode;
  filterable?: boolean;
  CustomFilterComponent?: ComponentType<XTableFilterProps>;
  CustomFilterPanelItemComponent?: ComponentType<XTableFilterPanelItemContentProps<T>>;
  type?: XTableColumnType;
  settings?: Partial<
    Pick<PropertySchemaChoice, 'options'> &
      Pick<PropertySchemaFloat, 'precision'> &
      Pick<PropertySchemaDatetime, 'format'> &
      Pick<PropertySchemaUrl, 'openIn'> &
      Pick<PropertySchemaString, 'display'> & { relations: Relation[] }
  >;
  sortable?: boolean;
  CellContent?: ComponentType<XTableCustomCellProps<T>>;
  cellContentProps?: XTableCellContentProps<T>;
  BeforeCellContent?: ComponentType<XTableCustomCellProps<T>>;
  AfterCellContent?: ComponentType<XTableCustomCellProps<T>>;
  getIdBadge?(rowData: T): string | number;
  cellProps?: TableCellProps;
  headerCellProps?: TableCellProps;
  align?: TableCellProps['align'];
  hidden?: boolean;
  width?: number;
  maxDefaultWidth?: number;
  enableMaxDefaultWidth?: boolean;
  minWidth?: number;
}

export interface XTableCustomCellProps<T> {
  rowData: T;
  col: XTableColumn<T>;
  filterActive: boolean;
  filterParams: FilterQuery;
}

export const colsTypesAlign: Partial<Record<XTableColumnType, TableCellProps['align']>> = {
  [PropertyType.BOOL]: 'center',
  [PropertyType.DATETIME]: 'center',
  [XTableExtraColumnType.ID]: 'right',
  [PropertyType.INT]: 'right',
  [PropertyType.LONG]: 'right',
  [PropertyType.FLOAT]: 'right'
};
