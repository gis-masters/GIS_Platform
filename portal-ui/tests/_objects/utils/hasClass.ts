export async function hasClass($element: WebdriverIO.Element, className: string): Promise<boolean> {
  const cls = await $element.getAttribute('class');
  if (!cls) {
    throw new Error('Ошибка получения классов');
  }

  return cls.split(' ').includes(className);
}
