import { Then } from '@wdio/cucumber-framework';

import { sleep } from '../../../../../src/app/services/util/sleep';
import { mapMapBlock } from './Map-Map.block';

Then('на карте отобража{}тся {string}', async (_: string, variant: string) => {
  await sleep(300); // ожидание различных подгрузок связанных с инетом или недостаточной мощностью пк
  await mapMapBlock.assertSelfie(variant.split(' ').join('-'));
});
