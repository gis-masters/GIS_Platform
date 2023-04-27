import { usersClient } from '../../../../src/app/services/auth/users/users.client';
import { NewUserData } from '../../../../src/app/services/auth/users/users.models';
import { getTestUser } from './testUsers';
import { requestAs } from '../requestAs';

export async function createUserAs(userData: NewUserData, username: string): Promise<void> {
  await requestAs(getTestUser(username), usersClient.createUser, userData);
}
