import { When } from '@wdio/cucumber-framework';

export async function saveScreenshot(fileName = 'screen'): Promise<void> {
  await browser.saveScreenshot('tests/_screens/.tmp/' + fileName + '.png');
}

When(/^тестовый скриншот "(.*)"|тестовый скриншот/, async (screenshotName: string) => {
  await saveScreenshot(screenshotName);
});
