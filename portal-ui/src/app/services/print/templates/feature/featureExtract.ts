import { flags } from '../../../common/feature-flags/feature-flags.service';
import { type WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { PrintTemplate } from '../PrintTemplate';

/**
 * Временная функция для выбора механизма печати выписки об объекте.
 * Будет удалена после завершения перехода на новый механизм печати и удаления флага oldPrintMechanism.
 */
export const featureExtract: PrintTemplate<WfsFeature> = new PrintTemplate({
  name: 'featureExtract',
  title: 'Выписка об объекте',

  async render(this: PrintTemplate<WfsFeature>, feature: WfsFeature) {
    if (flags.oldPrintMechanism) {
      const { featureExtractOld } = await import('./featureExtract_old');

      await featureExtractOld.print(feature);
    }

    const { featureExtractNew } = await import('./featureExtract_new');

    await featureExtractNew.print(feature);
  },

  async getFileName(this: PrintTemplate<WfsFeature>, entity: WfsFeature) {
    if (flags.oldPrintMechanism) {
      const { featureExtractOld } = await import('./featureExtract_old');

      return await featureExtractOld.getFileName(entity);
    }

    const { featureExtractNew } = await import('./featureExtract_new');

    return await featureExtractNew.getFileName(entity);
  }
});
