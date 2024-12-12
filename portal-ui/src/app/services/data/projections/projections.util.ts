import { isStringArray } from '../../util/typeGuards/isStringArray';
import { Projection, ProjectionUnit } from './projections.models';

export function getSrid(projectionCode: string): number {
  const srid = projectionCode.split(':')[1];

  if (!srid) {
    throw new Error('Некорректный код проекции');
  }

  return Number(srid);
}

export function projectionCodeToProjection(projectionCode: string): Projection {
  const split = projectionCode.split(':');
  const authName = split[0];
  if (!authName) {
    throw new Error(`Некорректный код проекции:${projectionCode}`);
  }

  const authSrid = split[1];
  if (!authSrid) {
    throw new Error(`Некорректный код проекции:${projectionCode}`);
  }

  return {
    auth_name: authName,
    authName: authName,
    auth_srid: Number(authSrid),
    authSrid: Number(authSrid),
    title: projectionCode,
    srtext: '',
    proj4Text: ''
  };
}

export function getProjectionCode(projection: Projection): string {
  return `${projection.authName}:${projection.authSrid}`;
}

export function getProjectionUnit(proj: string): ProjectionUnit {
  const unit = proj.split('UNIT');

  if (isStringArray(unit)) {
    const unitName = unit.at(-1)?.split('",')[0].split('["')[1];
    if (unitName === 'degree') {
      return 'градусы';
    }

    if (unitName === 'metre') {
      return 'метры';
    }

    if (unitName === 'US survey foot ') {
      return 'геодезический фут США';
    }
  }

  return '';
}

export function getProjectionTitle(proj: string): string {
  const projcsRegex = /PROJCS\["([^"]+)",/;
  const geogcsRegex = /GEOGCS\["([^"]+)",/;
  const unknownRegex = /\["([^"]+)",/;

  const extractTitle = (regex: RegExp): string | null => {
    const match = proj.match(regex);

    return match ? match[1].replaceAll('_', ' ') : null;
  };

  const projcsTitle = extractTitle(projcsRegex);
  if (projcsTitle) {
    return projcsTitle;
  }

  const geogcsTitle = extractTitle(geogcsRegex);
  if (geogcsTitle) {
    return geogcsTitle;
  }

  const unknownTitle = extractTitle(unknownRegex);
  if (unknownTitle) {
    return unknownTitle;
  }

  console.warn('Тип SRID не определен');

  return 'Тип SRID не определен';
}
