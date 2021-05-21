import { ScaleLine as BaseScaleLine } from 'ol/control';

const normalUnits = {
  nm: 'нм',
  μm: 'мкм',
  mm: 'мм',
  m: 'м',
  km: 'км'
};

export class ScaleLine extends BaseScaleLine {
  createStepText(i: number, width: number, isLast: boolean, scale: number, suffix: string): string {
    return super.createStepText(i, width, isLast, scale, normalUnits[suffix] || suffix);
  }
}
