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

  createScaleBar(width: number, scale: number, suffix: string): number {
    /* eslint-disable @typescript-eslint/no-unsafe-return */
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    // @ts-ignore
    return super.createScaleBar(width, scale, suffix).replace(/,(\d{3})/g, ' $1');
    /* eslint-enable @typescript-eslint/no-unsafe-return */
    /* eslint-enable @typescript-eslint/ban-ts-comment */
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
    /* eslint-enable @typescript-eslint/no-unsafe-call */
  }

  setDpi(dpi?: number): void {
    return super.setDpi(dpi);
  }
}
