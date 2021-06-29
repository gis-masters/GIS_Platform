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
