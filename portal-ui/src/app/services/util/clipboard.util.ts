export function copyToClipboard(value: string): void {
  if (navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(value);

    return;
  }

  const parent = document.querySelector('.MuiModal-root :focus')?.parentNode || document.body;
  const area = document.createElement('textarea');
  parent.append(area);

  area.value = value;
  area.select();
  try {
    document.execCommand('copy');
  } catch {
    throw new Error('Не копируется :(');
  }

  area.remove();
}

export function copyNodeToClipboard(node: HTMLElement): void {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(node);
  selection?.removeAllRanges();
  selection?.addRange(range);

  try {
    document.execCommand('copy');
  } catch {
    throw new Error('Не копируется :(');
  }

  selection?.removeAllRanges();
}
