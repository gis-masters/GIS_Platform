import {
  GeometryType,
  type WfsGeometry,
  type WfsLineStringGeometry,
  type WfsMultiLineStringGeometry,
  type WfsMultiPolygonGeometry,
  type WfsPolygonGeometry
} from '../../geoserver/wfs/wfs.models';

export function mergeGeometry(
  newGeometry: WfsGeometry,
  currentGeometry: WfsGeometry | undefined,
  geometryType: GeometryType
): WfsGeometry {
  let mergedGeometry: WfsGeometry | undefined = newGeometry;

  switch (geometryType) {
    case GeometryType.LINE_STRING: {
      // Преобразуем в MULTI_LINE_STRING
      const currentCoords = (currentGeometry as WfsLineStringGeometry).coordinates;
      mergedGeometry = {
        type: GeometryType.MULTI_LINE_STRING,
        coordinates: [(newGeometry as WfsLineStringGeometry).coordinates, currentCoords]
      };
      break;
    }
    case GeometryType.MULTI_LINE_STRING: {
      // Добавляем к существующему MULTI_LINE_STRING
      const currentCoords = (currentGeometry as WfsMultiLineStringGeometry).coordinates;
      const newCoords = (newGeometry as WfsMultiLineStringGeometry).coordinates;
      mergedGeometry = {
        type: GeometryType.MULTI_LINE_STRING,
        coordinates: [...newCoords, ...currentCoords]
      };
      break;
    }
    case GeometryType.POLYGON: {
      // Преобразуем в MULTI_POLYGON
      const currentCoords = (currentGeometry as WfsPolygonGeometry).coordinates;
      mergedGeometry = {
        type: GeometryType.MULTI_POLYGON,
        coordinates: [(newGeometry as WfsPolygonGeometry).coordinates, currentCoords]
      };
      break;
    }
    case GeometryType.MULTI_POLYGON: {
      // Добавляем к существующему MULTI_POLYGON
      const currentCoords = (currentGeometry as WfsMultiPolygonGeometry).coordinates;
      const newCoords = (newGeometry as WfsMultiPolygonGeometry).coordinates;
      mergedGeometry = {
        type: GeometryType.MULTI_POLYGON,
        coordinates: [...newCoords, ...currentCoords]
      };
      break;
    }
    default: {
      break;
    }
  }

  return mergedGeometry;
}
