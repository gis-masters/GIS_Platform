export enum GeometryType {
  POLYGON = 'polygon',
  LINE = 'line',
  POINT = 'point',
}

export class StringUtil {

  // 'yypefc'
  static generateRandomId() {
    return Math.random().toString(36).substring(2, 8);
  }

  static addGeometryTypeToTitle(title: string, featureName: string) {
    return '(' + StringUtil.defineGeomType(featureName) + ') ' + title;
  }

  public static defineGeomType(featureName: string): GeometryType {
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
  }
}
