export const RESERVED_PROPERTY_NAME_ERROR = 'Имя поля не может быть true или false';

export function isReservedPropertyName(name: string): boolean {
  return /^(?:true|false)$/i.test(name.trim());
}
