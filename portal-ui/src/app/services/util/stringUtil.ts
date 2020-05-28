export enum GeometryType {
  POLYGON = 'polygon',
  LINE = 'line',
  POINT = 'point',
}

export const generateRandomId = () => Math.random().toString(36).substring(2, 8);

export const addGeometryTypeToTitle = (title: string, featureName: string) => `(${defineGeomType(featureName)}) ${title}`;

export const defineGeomType = (featureName: string): GeometryType => {
  if (featureName.includes('_')) {
    const element = featureName.split('_')[1];

    if (GeometryType.LINE === element) {
      return GeometryType.LINE;
    } else if (GeometryType.POINT === element) {
      return GeometryType.POINT;
    }
  } else {
    return GeometryType.POLYGON;
  }
};
