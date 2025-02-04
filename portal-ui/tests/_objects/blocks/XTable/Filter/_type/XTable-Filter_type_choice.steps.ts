import { Then } from '@wdio/cucumber-framework';

import { xTableFilterTypeChoiceBlock } from './XTable-Filter_type_choice.block';

Then('блок xTableFilterTypeChoice вариант {string} выглядит как положено', async (variant: string) => {
  await xTableFilterTypeChoiceBlock.assertSelfie(variant);
});
