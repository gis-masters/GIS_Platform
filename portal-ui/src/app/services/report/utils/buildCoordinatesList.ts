import { type Coordinate } from 'ol/coordinate';

import { GeometryType, type WfsGeometry } from '../../geoserver/wfs/wfs.models';
import { isPolygonal, selectLabelForGeometryType } from '../../geoserver/wfs/wfs.util';

const COORD_PRECISION = 2;

export function roundCoord(n: number): number {
  return Math.round(n * 10 ** COORD_PRECISION) / 10 ** COORD_PRECISION;
}

export type PrintableCoordinate = {
  num: number;
  x: number;
  y: number;
};

export type PrintableCoordinatesChunk = {
  title?: string;
  coordinates: PrintableCoordinate[];
};

function prepareCoordinates(coordinates: Coordinate[], ring = false, startIndex = 1): PrintableCoordinate[] {
  return coordinates.map(([x, y], i) => ({
    num: ring && i === coordinates.length - 1 ? startIndex : i + startIndex,
    x: roundCoord(x),
    y: roundCoord(y)
  }));
}

function buildPointChunks(coordinates: Coordinate): PrintableCoordinatesChunk[] {
  const [x, y] = coordinates;

  return [{ coordinates: [{ num: 1, x: roundCoord(x), y: roundCoord(y) }] }];
}

function buildLineChunks(coordinates: Coordinate[]): PrintableCoordinatesChunk[] {
  return [{ coordinates: prepareCoordinates(coordinates) }];
}

function buildPolygonOrMultiLineStringChunks(
  coordinates: Coordinate[][],
  geometryType: GeometryType
): PrintableCoordinatesChunk[] {
  const chunks: PrintableCoordinatesChunk[] = [];
  let lastNum = 0;
  const polygonal = isPolygonal(geometryType);
  const singleChunk = coordinates.length === 1;

  for (const [chunkIndex, chunk] of coordinates.entries()) {
    chunks.push({
      title: singleChunk ? undefined : selectLabelForGeometryType(geometryType, 'Контур ', 'Линия ') + (chunkIndex + 1),
      coordinates: prepareCoordinates(chunk, polygonal, lastNum + 1)
    });

    lastNum += chunk.length - (polygonal ? 1 : 0);
  }

  return chunks;
}

function buildMultiPolygonChunks(coordinates: Coordinate[][][]): PrintableCoordinatesChunk[] {
  const chunks: PrintableCoordinatesChunk[] = [];
  let lastNum = 0;

  for (let polygonIndex = 0; polygonIndex < coordinates.length; polygonIndex++) {
    const polygon = coordinates[polygonIndex];

    for (let ringIndex = 0; ringIndex < polygon.length; ringIndex++) {
      const ring = polygon[ringIndex];
      const polygonTitle = coordinates.length > 1 ? `Полигон ${polygonIndex + 1}` : '';
      let ringTitle = '';
      if (polygon.length > 1) {
        ringTitle = polygonTitle ? `, контур ${ringIndex + 1}` : `Контур ${ringIndex + 1}`;
      }

      chunks.push({
        title: polygonTitle + ringTitle || undefined,
        coordinates: prepareCoordinates(ring, true, lastNum + 1)
      });

      lastNum += ring.length - 1;
    }
  }

  return chunks;
}

export function buildCoordinatesList(geometry?: WfsGeometry): PrintableCoordinatesChunk[] {
  if (!geometry) {
    return [];
  }

  switch (geometry.type) {
    case GeometryType.POINT: {
      return buildPointChunks(geometry.coordinates);
    }
    case GeometryType.MULTI_POINT:
    case GeometryType.LINE_STRING: {
      return buildLineChunks(geometry.coordinates);
    }
    case GeometryType.POLYGON:
    case GeometryType.MULTI_LINE_STRING: {
      return buildPolygonOrMultiLineStringChunks(geometry.coordinates, geometry.type);
    }
    case GeometryType.MULTI_POLYGON: {
      return buildMultiPolygonChunks(geometry.coordinates);
    }
    default: {
      return [];
    }
  }
}
