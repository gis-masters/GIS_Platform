import { SpecializationView } from '../../../../server-types/common-contracts';
import { isAxiosError } from '../../util/typeGuards/isAxiosError';
import { specializationsClient } from './specializations.client';

const message = 'Ошибка получения специализаций';

export async function getSpecializations(): Promise<SpecializationView[]> {
  try {
    const specializations = await specializationsClient.getSpecializations();

    if (!specializations) {
      throw new Error(message);
    }

    return specializations;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message || message);
    }

    throw error;
  }
}
