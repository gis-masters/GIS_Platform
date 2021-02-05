import GeometryType from 'ol/geom/GeometryType';

import { CoordinateEdited, WfsGeometry } from './wfs.models';
import { CrgModels, FilterEvent } from '../models';

export function getEmptyGeometry(geometryType: GeometryType): WfsGeometry<CoordinateEdited> {
  if (geometryType === GeometryType.POINT) {
    return {
      type: GeometryType.POINT,
      coordinates: ['', '']
    };
  }

  if (geometryType === GeometryType.MULTI_LINE_STRING) {
    return {
      type: GeometryType.MULTI_LINE_STRING,
      coordinates: [
        [
          ['', ''],
          ['', '']
        ]
      ]
    };
  }

  if (geometryType === GeometryType.MULTI_POLYGON) {
    return {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            ['', ''],
            ['', ''],
            ['', ''],
            ['', '']
          ]
        ]
      ]
    };
  }
}

function isLinear(geometryType: GeometryType) {
  return [
    GeometryType.CIRCLE,
    GeometryType.LINEAR_RING,
    GeometryType.LINE_STRING,
    GeometryType.MULTI_LINE_STRING
  ].includes(geometryType);
}

function isPolygonal(geometryType: GeometryType) {
  return [GeometryType.MULTI_POLYGON, GeometryType.POLYGON].includes(geometryType);
}

function isPoint(geometryType: GeometryType) {
  return geometryType === GeometryType.POINT;
}

export function selectLabelForGeometryType(
  geometryType: GeometryType,
  ifPolygonal: string,
  ifLinear: string,
  ifPointOrOther?: string,
  ifOther?: string
): string {
  if (isPolygonal(geometryType)) {
    return ifPolygonal;
  } else if (isLinear(geometryType)) {
    return ifLinear;
  } else if (isPoint(geometryType)) {
    return ifPointOrOther;
  } else {
    return ifOther || ifPointOrOther;
  }
}

export function generateSortParam(requestModel: CrgModels): string {
  if (!requestModel || !requestModel.sort || !requestModel.sort.column) {
    return '';
  }

  let order = '+A';
  if (requestModel.sort.newValue === 'desc') {
    order = '+D';
  }

  const columnName = requestModel.sort.column.prop.split('.')[1];

  return columnName ? columnName + order : '';
}

export function generateFilter(requestModel: CrgModels): string | undefined {
  if (!requestModel) {
    return undefined;
  }

  const filter = requestModel.filter;
  if (!filter || !filter.length) {
    return undefined;
  }

  let filterString = '';
  filter.forEach((filterEvent: FilterEvent) => {
    if (filterString !== '') {
      filterString += ' AND ';
    }

    filterString = filterString + this.parseFilter(filterEvent);
  });

  return filterString;
}
