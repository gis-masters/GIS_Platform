import { Then } from '@wdio/cucumber-framework';

import {
  assertFeatureExtractJpegSnapshotMatchesBaseline,
  assertFeatureExtractPdfSnapshotMatchesBaseline,
  assertPrintResultOpenedInBrowserTab
} from '../helpers/visual/printFeatureExtractVisual';

Then('открыта вкладка с {word} результата печати', async (resultKind: string) => {
  if (resultKind !== 'документом' && resultKind !== 'изображением') {
    throw new Error(`Неизвестный вид результата печати: ${resultKind}`);
  }

  await assertPrintResultOpenedInBrowserTab();
});

Then('снимок страницы с {word}-выпиской совпадает с эталоном {word}', async (format: string, tag: string) => {
  if (format === 'PDF') {
    await assertFeatureExtractPdfSnapshotMatchesBaseline(tag);

    return;
  }
  if (format === 'JPEG') {
    await assertFeatureExtractJpegSnapshotMatchesBaseline(tag);

    return;
  }

  throw new Error(`Неизвестный формат выписки для сравнения: ${format}`);
});
