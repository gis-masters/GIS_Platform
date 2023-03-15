export async function extractText($$cells: WebdriverIO.Element[]): Promise<string[]> {
  const contents: string[] = [];
  for (const $cell of $$cells) {
    contents.push(await $cell.getText());
  }

  return contents;
}
