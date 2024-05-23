import axios from 'axios';

import { environment, EnvironmentData } from '../../../src/app/services/environment';

export async function getEnvironment(): Promise<void> {
  if (!environment.inited) {
    if (!browser.options.baseUrl) {
      throw new Error('Ошибка конфигурации. Отсутствует baseUrl.');
    }

    const { data } = await axios.get<EnvironmentData>(`${browser.options.baseUrl}/assets/config/environment.json`);

    environment.init(data);
  }
}
