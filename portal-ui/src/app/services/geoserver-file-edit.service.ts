import { http } from './http.service';
import { getGeoserverFileUrl } from './server-urls.service';

import { Toast } from '../components/Toast/Toast';
import { currentUser } from '../stores/CurrentUser.store';

export interface CoverageTransparentColorEntry {
  string: Record<string, string>;
}

interface CoverageTransparentColor {
  coverage: {
    parameters: {
      entry: CoverageTransparentColorEntry | Record<string, string>[];
    };
  };
}

export async function updateFileTransparentColor(coverages: string, InputTransparentColor: string): Promise<void> {
  const value = {
    coverage: {
      parameters: {
        entry: [
          {
            string: ['InputTransparentColor', InputTransparentColor]
          }
        ]
      }
    }
  };

  try {
    await http.put(await getGeoserverFileUrl(currentUser.workspaceName, coverages), value);
  } catch {
    Toast.error({
      message: 'Не удалось обновить настройки слоя'
    });
  }
}

export async function getFileTransparentColor(coverages: string): Promise<CoverageTransparentColor> {
  try {
    return await http.get(await getGeoserverFileUrl(currentUser.workspaceName, coverages));
  } catch {
    Toast.error({
      message: 'Не удалось обновить настройки слоя'
    });
  }
}
