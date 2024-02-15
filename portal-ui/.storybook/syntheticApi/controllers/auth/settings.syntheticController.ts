import { InternalAxiosRequestConfig } from 'axios';

import { SyntheticController } from '../masterController';
import { err404 } from '../../utils';
import { OrgSettings } from '../../../../src/app/stores/OrganizationSettings.store';

class SettingsSyntheticController implements SyntheticController {
  pattern = /^.*\/organizations\/settings$/;

  get(config: InternalAxiosRequestConfig): OrgSettings {
    if (!config.url) {
      throw err404(config);
    }

    return {
      id: 63,
      system: {
        reestrs: true,
        sedDialog: true,
        downloadXml: true,
        createProject: true,
        downloadFiles: true,
        dataManagement: true,
        taskManagement: true,
        editProjectLayer: true,
        createLibraryItem: true,
        tags: ['Приказ 123', 'Приказ 10']
      },
      organization: {
        reestrs: true,
        sedDialog: true,
        downloadXml: true,
        createProject: true,
        downloadFiles: true,
        dataManagement: true,
        taskManagement: true,
        editProjectLayer: true,
        createLibraryItem: true,
        tags: ['Приказ 123', 'Приказ 10']
      }
    };
  }
}

export const settingsSyntheticController = new SettingsSyntheticController();
