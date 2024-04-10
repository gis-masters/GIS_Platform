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

export const extractFeatureTypeName = (id: string): string => {
  const [featureTypeName] = id.split('.');
  if (!featureTypeName) {
    throw new Error('Передан некорректный идентификатор объекта: ' + id);
  }

  return featureTypeName;
};

const extractTableNameFromFeatureTypeName = (featureTypeName: string): string => {
  return featureTypeName.replace(/__\d+$/, '').replace(/\d+__/, '');
};

export const extractTableNameFromFeatureId = (id: string): string => {
  return extractTableNameFromFeatureTypeName(extractFeatureTypeName(id));
};

export const extractTableNameFromComplexName = (complexName: string): string => {
  return extractTableNameFromFeatureTypeName(extractFeatureTypeNameFromComplexName(complexName));
};

export const extractFeatureTypeNameFromComplexName = (complexName: string | undefined): string => {
  return splitComplexName(complexName)[1];
};

export const extractWorkspaceFromComplexName = (complexName: string | undefined): string => {
  return splitComplexName(complexName)[0];
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
