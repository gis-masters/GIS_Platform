import { Toast } from '../../components/Toast/Toast';
import { currentUser } from '../../stores/CurrentUser.store';
import { http } from '../api/http.service';
import { getGeoserverFileUrl } from '../api/server-urls.service';

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
    await http.put(getGeoserverFileUrl(currentUser.workspaceName, coverages), value);
  } catch {
    throw new Error('Не удалось обновить настройки слоя');
  }
}

export async function getFileTransparentColor(coverages: string): Promise<CoverageTransparentColor | undefined> {
  try {
    return await http.get(getGeoserverFileUrl(currentUser.workspaceName, coverages));
  } catch {
    Toast.error({
      message: 'Не удалось получить настройки слоя'
    });
  }
}
