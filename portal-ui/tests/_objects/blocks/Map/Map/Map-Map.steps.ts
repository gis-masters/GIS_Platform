import { Then } from '@wdio/cucumber-framework';

import { mapMapBlock } from './Map-Map.block';

Then('на карте отображаются только {string}', async (variant: string) => {
  await mapMapBlock.assertSelfie(variant.split(' ').join('-'));
});
