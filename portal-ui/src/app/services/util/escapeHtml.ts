const htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;'
};

export function escapeHtml(str: string): string {
  return str.replace(/[&<>"'\/]/g, function (match) {
    return htmlEscapes[match];
  });
}
