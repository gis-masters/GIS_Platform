import { authClient } from '../../../../src/app/services/auth/auth/auth.client';
import { TestUser } from './testUsers';

export async function getUserToken(user: TestUser): Promise<string> {
  const token = await authClient.authenticate({ username: user.email, password: user.password });

  if (typeof token !== 'string') {
    throw new TypeError('К выбору организации мы пока не готовы');
  }

  return token;
}
