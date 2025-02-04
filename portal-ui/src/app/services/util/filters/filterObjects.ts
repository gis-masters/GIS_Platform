import sift from 'sift';

import { WfsFeature } from '../../geoserver/wfs/wfs.models';
import { escapeStringRegexp } from '../escapeStringRegexp';
import { FilterQuery } from './filters.models';

export function filterFeatures(features: WfsFeature[], query: FilterQuery): WfsFeature[] {
  return features.filter(({ properties }) => sift(prepareLike(query))(properties));
}

export function filterObjects<T>(arr: T[], query: FilterQuery): T[] {
  return arr.filter(sift(prepareLike(query)));
}

export function prepareLike(query: FilterQuery): FilterQuery {
  const newQuery: FilterQuery = {};

  for (const [key, value] of Object.entries(query)) {
    if (key === '$like' && typeof value === 'string') {
      newQuery.$regex = new RegExp(`^${escapeStringRegexp(value).replaceAll('%', '.*').replaceAll(/\\./g, '.')}$`);
    } else if (key === '$ilike' && typeof value === 'string') {
      newQuery.$regex = new RegExp(`^${escapeStringRegexp(value).replaceAll('%', '.*').replaceAll(/\\./g, '.')}$`, 'i');
    } else if (typeof value === 'object' && key !== '$regex' && !Array.isArray(value) && value !== null) {
      newQuery[key] = prepareLike(value as FilterQuery);
    } else if (Array.isArray(value) && ['$and', '$or'].includes(key)) {
      newQuery[key] = value.map(filterPart => prepareLike(filterPart as FilterQuery));
    } else {
      newQuery[key] = value;
    }
  }

  return newQuery;
}
