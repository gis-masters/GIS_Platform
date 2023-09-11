/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ScaleLine as BaseScaleLine } from 'ol/control';

const normalUnits: Record<string, string> = {
  nm: 'нм',
  μm: 'мкм',
  mm: 'мм',
  m: 'м',
  km: 'км'
};

//@ts-ignore
export class ScaleLine extends BaseScaleLine {
  createStepText(i: number, width: number, isLast: boolean, scale: number, suffix: string): string {
    return super.createStepText(i, width, isLast, scale, normalUnits[suffix] || suffix);
  }

  createScaleBar(width: number, scale: number, suffix: string): number {
    /* eslint-disable @typescript-eslint/no-unsafe-return */
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    // @ts-ignore
    return super.createScaleBar(width, scale, suffix).replaceAll(/,(\d{3})/g, ' $1');
    /* eslint-enable @typescript-eslint/no-unsafe-return */
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
    /* eslint-enable @typescript-eslint/no-unsafe-call */
  }

  setDpi(dpi?: number): void {
    return super.setDpi(dpi);
  }
}
