import { Then } from '@wdio/cucumber-framework';

import { xTableFilterTypeBoolBlock } from './XTable-Filter_type_bool.block';

Then('блок xTableFilterTypeBool вариант {string} выглядит как положено', async (variant: string) => {
  await xTableFilterTypeBoolBlock.assertSelfie(variant);
});
