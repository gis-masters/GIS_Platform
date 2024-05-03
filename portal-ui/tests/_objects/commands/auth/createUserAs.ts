import { usersClient } from '../../../../src/app/services/auth/users/users.client';
import { NewUserData } from '../../../../src/app/services/auth/users/users.models';
import { requestAs } from '../requestAs';
import { getTestUser } from './testUsers';

export async function createUserAs(userData: NewUserData, username: string): Promise<void> {
  await requestAs(getTestUser(username), usersClient.createUser, userData);
}
