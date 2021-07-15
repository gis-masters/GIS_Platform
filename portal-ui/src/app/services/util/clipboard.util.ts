export function copyToClipboard(value: string): void {
  const body = document.body;
  const area = document.createElement('textarea');
  body.append(area);

  area.value = value;
  area.select();
  document.execCommand('copy');

  area.remove();
}

export function copyNodeToClipboard(node: HTMLElement): void {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(node);
  selection.removeAllRanges();
  selection.addRange(range);

  try {
    document.execCommand('copy');
  } catch {
    throw new Error('Не копируется :(');
  }

  selection.removeAllRanges();
}
