import { Then } from '@wdio/cucumber-framework';

import { xTableFilterTypeDateTimeBlock } from './XTable-Filter_type_dateTime.block';

Then('блок xTableFilterTypeDateTime вариант {string} выглядит как положено', async (variant: string) => {
  await xTableFilterTypeDateTimeBlock.assertSelfie(variant);
});
