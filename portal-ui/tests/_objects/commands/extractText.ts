export async function extractText($$elements: WebdriverIO.Element[] | WebdriverIO.ElementArray): Promise<string[]> {
  const contents: string[] = [];
  for (const $element of $$elements) {
    contents.push(await $element.getText());
  }

  return contents;
}

export async function extractValues($$controls: WebdriverIO.Element[]): Promise<string[]> {
  const contents: string[] = [];
  for (const $control of $$controls) {
    contents.push(await $control.getValue());
  }

  return contents;
}
