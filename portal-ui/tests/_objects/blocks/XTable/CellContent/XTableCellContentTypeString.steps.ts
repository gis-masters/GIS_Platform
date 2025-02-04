import { Then } from '@wdio/cucumber-framework';

import { xTableCellContentTypeStringBlock } from './XTableCellContentTypeString.block';

Then('блок XTableCellContentTypeString вариант {string} выглядит как положено', async (variant: string) => {
  await xTableCellContentTypeStringBlock.assertSelfie(variant);
});
