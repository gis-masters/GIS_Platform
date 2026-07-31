/**
 * Double-click через pointer Actions по viewport-координатам.
 * Работает стабильнее, чем element.doubleClick().
 */
export async function doubleClick($element: WebdriverIO.Element): Promise<void> {
  const { x, y } = await $element.getLocation();
  const { width, height } = await $element.getSize();
  const clickX = Math.round(x + width / 2);
  const clickY = Math.round(y + height / 2);

  await browser.action('pointer').move({ x: clickX, y: clickY }).down().up().pause(50).down().up().perform();
}
