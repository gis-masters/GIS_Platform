export function extractFeatureId(featureId: string): number {
  const errMsg = `Передан некорректный идентификатор фичи: '${featureId}'`;

  if (!featureId) {
    throw new Error(errMsg);
  }

  const identifier = featureId.trim();
  if (identifier === '') {
    throw new Error(errMsg);
  }

  let id = Number(identifier);
  if (!Number.isNaN(id)) {
    return id;
  }

  const split = identifier.split('.');
  if (!split || !split[1]) {
    throw new Error(errMsg);
  }

  id = Number(split[1]);
  if (!Number.isNaN(id)) {
    return id;
  }

  throw new Error(errMsg);
}
