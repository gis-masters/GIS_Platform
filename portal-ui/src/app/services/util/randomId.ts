export function generateRandomId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);

  return [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
}
