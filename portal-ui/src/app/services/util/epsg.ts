export function epsgUnit(epsg: string): string {
  const unit = epsg.split('UNIT');
  const unitName = unit.at(-1).split('",')[0].split('["')[1];

  if (unitName === 'degree') {
    return 'градусы';
  }

  if (unitName === 'metre') {
    return 'метры';
  }
}

export function epsgTitle(epsg: string): string {
  let projection = epsg.split('PROJCS');

  if (projection.length === 1) {
    projection = epsg.split('GEOGCS');
  }

  return projection[1].split('",')[0].split('["')[1];
}
