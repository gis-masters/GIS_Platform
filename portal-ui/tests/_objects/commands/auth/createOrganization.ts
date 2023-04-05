import { RegData } from '../../../../src/app/services/auth/auth/auth.models';
import { _reqRegistration } from '../../../../src/app/services/auth/auth/auth.client';

export async function createOrganization(regData: RegData): Promise<void> {
  return await _reqRegistration(regData);
}
