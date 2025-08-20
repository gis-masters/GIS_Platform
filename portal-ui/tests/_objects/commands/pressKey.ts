import { When } from '@wdio/cucumber-framework';

When('я дважды нажимаю клавишу `Esc`', async () => {
  await browser.keys('\uE00C');
  await browser.keys('\uE00C');
});
