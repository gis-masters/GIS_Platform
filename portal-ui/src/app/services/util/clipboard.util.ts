import { Mime } from './Mime';

export async function copyToClipboard(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
}

export async function copyNodeToClipboard(node: HTMLElement): Promise<void> {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(node);
  selection?.removeAllRanges();
  selection?.addRange(range);

  // Выделение сохраняет переносы строк и табуляции между ячейками, textContent склеил бы всё в одну строку
  const text = selection?.toString() ?? '';
  selection?.removeAllRanges();

  await navigator.clipboard.write([
    new ClipboardItem({
      [Mime.HTML]: new Blob([node.outerHTML], { type: Mime.HTML }),
      [Mime.TEXT]: new Blob([text], { type: Mime.TEXT })
    })
  ]);
}
