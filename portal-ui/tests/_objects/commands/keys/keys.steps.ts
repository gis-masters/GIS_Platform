import { When } from '@wdio/cucumber-framework';
import { Key } from 'webdriverio';

When('жму кнопку `Esc`', async () => {
  await browser.keys([Key.Escape]);
});
