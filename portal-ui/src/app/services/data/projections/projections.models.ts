import { type SpatialReferenceSystem } from '../../../../server-types/common-contracts';
import { type XTableColumn, XTableExtraColumnType } from '../../../components/XTable/XTable.models';
import { PropertyType } from '../schema/schema.models';

export const DEFAULT_OL_PROJECTION = {
  authName: 'EPSG',
  srid: 3857
};

export const defaultOlProjectionCode = `${DEFAULT_OL_PROJECTION.authName}:${DEFAULT_OL_PROJECTION.srid}`;

export interface Projection extends SpatialReferenceSystem {
  title: string;
  auth_srid: number;
  auth_name: string;
  hidden?: boolean;
  proj4Str?: string;
}

export interface EditProjectionModel {
  srtext: string;
  proj4Text: string;
}

export const projectionXTableCols: XTableColumn<Projection>[] = [
  {
    field: 'title',
    title: 'Система координат',
    minWidth: 300
  },
  {
    field: 'auth_name',
    title: 'Тип SRID',
    filterable: true,
    type: PropertyType.CHOICE,
    minWidth: 100,
    settings: {
      options: [
        {
          title: 'EPSG',
          value: 'EPSG'
        },
        {
          title: 'ESRI',
          value: 'ESRI'
        },
        {
          title: 'CRG',
          value: 'CRG'
        }
      ]
    }
  },
  {
    field: 'auth_srid',
    title: 'Код SRID',
    type: XTableExtraColumnType.ID,
    filterable: true,
    sortable: true,
    minWidth: 100
  },
  {
    field: 'srtext',
    title: 'WKT',
    description: 'Система координат в формате WKT',
    settings: { display: 'code' },
    filterable: true
  },
  {
    field: 'proj4Text',
    title: 'proj4',
    description: 'Система координат в формате proj4',
    settings: { display: 'code' },
    filterable: true
  }
];

export type ProjectionUnit = 'градусы' | 'метры' | 'геодезический фут США' | '';
