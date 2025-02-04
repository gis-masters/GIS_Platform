import { Then } from '@wdio/cucumber-framework';

import { xTableFilterTypeFloatBlock } from './XTable-Filter_type_float.block';

Then('блок xTableFilterTypeFloat вариант {string} выглядит как положено', async (variant: string) => {
  await xTableFilterTypeFloatBlock.assertSelfie(variant);
});
