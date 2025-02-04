import { isProjection, Projection } from '../data/projections/projections.models';
import { isStringArray } from './typeGuards/isStringArray';

export function mapToProjections(projections: unknown): Projection[] {
  if (!projections) {
    return [];
  }

  try {
    if (isStringArray(projections)) {
      return projections.map(item => {
        return mapToProjection(item);
      });
    }

    return [];
  } catch {
    throw new Error('Не удалось "прочитать" системы координат');
  }
}

function mapToProjection(projection: string): Projection {
  try {
    const parsedItem = JSON.parse(projection) as unknown;

    if (!isProjection(parsedItem)) {
      throw new Error('Система координат не является проекцией');
    }

    return parsedItem;
  } catch {
    throw new Error(`Не удалось "прочитать" систему координат: ${projection}`);
  }
}
