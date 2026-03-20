export async function saveScreenshot(fileName = 'screen'): Promise<void> {
  await browser.saveScreenshot('tests/_screens/.tmp/' + fileName + '.png');
}
