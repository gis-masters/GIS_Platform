import { type CrgUser } from './users.models';

export function formatCrgUserFio(user: CrgUser): string {
  return [user.surname, user.name, user.middleName].filter(Boolean).join(' ');
}
