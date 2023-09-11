const htmlEscapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;'
};

export function escapeHtml(str: string): string {
  return str.replaceAll(/["&'/<>]/g, match => {
    return htmlEscapes[match];
  });
}
