export async function hasClass($container: WebdriverIO.Element, clazz: string): Promise<boolean> {
  const cls = await $container.getAttribute('class');
  if (!cls) {
    throw new Error('Ошибка получения классов');
  }

  return cls.split(' ').includes(clazz);
}
