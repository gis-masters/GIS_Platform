import { authClient } from '../../../../src/app/services/auth/auth/auth.client';
import { RegData } from '../../../../src/app/services/auth/auth/auth.models';

export async function createOrganization(regData: RegData): Promise<void> {
  return await authClient.registration(regData);
}
