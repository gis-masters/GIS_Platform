import { Then } from '@wdio/cucumber-framework';

import { xTableCellContentTypeChoiceBlock } from './XTableCellContentTypeChoice.block';

Then('блок XTableCellContentTypeChoice вариант {string} выглядит как положено', async (variant: string) => {
  await xTableCellContentTypeChoiceBlock.assertSelfie(variant);
});
