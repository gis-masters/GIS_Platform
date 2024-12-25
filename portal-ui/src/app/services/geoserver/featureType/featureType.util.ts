import { getSrid } from '../../data/projections/projections.util';

export function extractFeatureId(featureId: string): number {
  const errMsg = `Передан некорректный идентификатор объекта: '${featureId}'`;

  if (!featureId) {
    throw new Error(errMsg);
  }

  const fid = featureId.trim?.() ?? featureId;
  if (fid === '') {
    throw new Error(errMsg);
  }

  let id = Number(fid);
  if (!Number.isNaN(id)) {
    return id;
  }

  const split = fid.split('.');
  if (!split || !split[1]) {
    throw new Error(errMsg);
  }

  id = Number(split[1]);
  if (!Number.isNaN(id)) {
    return id;
  }

  throw new Error(errMsg);
}

export const extractFeatureTypeName = (featureId: string): string => {
  if (featureId === undefined || featureId.length === 0) {
    return featureId;
  }

  const [featureTypeName] = String(featureId).split('.');
  if (!featureTypeName) {
    throw new Error('Не удалось извлечь featureTypeName. Передан некорректный идентификатор объекта: ' + featureId);
  }

  return featureTypeName;
};

function extractTableNameFromFeatureTypeName(featureTypeName: string): string {
  return featureTypeName.replace(/__\d+$/, '');
}

export const extractTableNameFromFeatureId = (id: string): string => {
  return extractTableNameFromFeatureTypeName(extractFeatureTypeName(id));
};

export const extractTableNameFromComplexName = (complexName: string): string => {
  if (!complexName.includes(':')) {
    return complexName;
  }

  return extractTableNameFromFeatureTypeName(splitComplexName(complexName)[1]);
};

export const extractFeatureTypeNameFromComplexName = (complexName: string | undefined): string => {
  return splitComplexName(complexName)[1];
};

export const extractWorkspaceFromComplexName = (complexName: string | undefined): string => {
  return splitComplexName(complexName)[0];
};

export function buildComplexName(workspace: string, tableName: string, crs?: string): string {
  let epsgCode = undefined;
  if (crs) {
    const code = crs.split(':')[1];
    if (code) {
      epsgCode = code;
    } else {
      throw new Error(`Передан некорректный crs: '${crs}'`);
    }
  }

  return epsgCode ? `${workspace}:${tableName}__${epsgCode}` : `${workspace}:${tableName}`;
}

export const createFeatureId = (tableName: string, nativeCRS: string, id: string): string => {
  return `${tableName}__${getSrid(nativeCRS)}.${id}`;
};

function splitComplexName(complexName: string | undefined): [string, string] {
  const errMsg = `Передан некорректный complexName: '${complexName}'`;

  if (!complexName) {
    throw new Error(errMsg);
  }

  const split = complexName.split(':');
  if (!split || !split[1]) {
    throw new Error(errMsg);
  }

  return [split[0], split[1]];
}
