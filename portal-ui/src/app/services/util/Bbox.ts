import { isCoordinate, isCoordinateArrayArray } from './typeGuards/isCoordinate';

export function calculateBbox(coordinates: unknown): [number, number, number, number] | null {
  // Для точки
  if (isCoordinate(coordinates) && coordinates.length === 2) {
    const padding = 1000; // отступ в единицах проекции

    return [coordinates[0] - padding, coordinates[1] - padding, coordinates[0] + padding, coordinates[1] + padding];
  }
  // Для полигона
  if (isCoordinateArrayArray(coordinates) && coordinates.length > 0) {
    const ring = coordinates[0];

    if (ring.length > 0) {
      let minX = Number.POSITIVE_INFINITY;
      let minY = Number.POSITIVE_INFINITY;
      let maxX = Number.NEGATIVE_INFINITY;
      let maxY = Number.NEGATIVE_INFINITY;

      ring.forEach(point => {
        minX = Math.min(minX, point[0]);
        minY = Math.min(minY, point[1]);
        maxX = Math.max(maxX, point[0]);
        maxY = Math.max(maxY, point[1]);
      });

      return [minX, minY, maxX, maxY];
    }
  }

  return null;
}
