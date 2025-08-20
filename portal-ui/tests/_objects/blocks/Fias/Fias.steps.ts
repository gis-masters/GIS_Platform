import { Then } from '@wdio/cucumber-framework';

import { fiasBlock } from './Fias.block';

Then('блок Fias вариант {string} выглядит как положено', async (variant: string) => {
  await fiasBlock.assertSelfie(variant);
});
