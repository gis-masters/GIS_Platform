import { Then } from '@wdio/cucumber-framework';

import { xTableCellContentTypeFiasBlock } from './XTableCellContentTypeFias.block';

Then('блок XTableCellContentTypeFias вариант {string} выглядит как положено', async (variant: string) => {
  await xTableCellContentTypeFiasBlock.assertSelfie(variant);
});
