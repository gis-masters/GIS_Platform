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

    filterString = filterString + parseFilter(filterEvent);
  });

  return filterString;
}

function parseFilter({ property, value }: FilterEvent): string {
  // name ILIKE %some%
  if (property.valueType === 'STRING') {
    return property.name.toLowerCase() + " ILIKE '%" + value + "%'";
  }

  // area BETWEEN n AND n+1
  if (property.valueType === 'DOUBLE') {
    return property.name.toLowerCase() + ' BETWEEN ' + value + ' AND ' + upLastDigit(value[0]);
  }

  if (property.valueType === 'INT') {
    return property.name.toLowerCase() + ' BETWEEN ' + value + ' AND ' + Number(value) + 0.9;
  }

  // foreignKeyType string => IN('110'), other => IN(110)
  if (property.valueType === 'CHOICE') {
    if (property.foreignKeyType === 'STRING') {
      return `${property.name.toLowerCase()} IN(${prepareChoiceValue(value)})`;
    } else {
      return property.name.toLowerCase() + ' IN(' + value + ')';
    }
  }

  return '';
}

function upLastDigit(numberUsString: string) {
  if (numberUsString.slice(-1) === '0') {
    return numberUsString.replace(/.$/, '1');
  } else {
    const n = Number(numberUsString);
    const k = n % 1 ? Math.pow(10, numberUsString.split('.')[1].length) : 1;

    return (n * k + 1) / k;
  }
}
function prepareChoiceValue(value: string[]): string {
  return value.map(item => `'${item}'`).join(',');
}
