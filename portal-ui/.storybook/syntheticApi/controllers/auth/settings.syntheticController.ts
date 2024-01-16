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
        prikaz_10: true,
        sedDialog: true,
        prikaz_123: true,
        downloadXml: true,
        createProject: true,
        downloadFiles: true,
        dataManagement: true,
        taskManagement: true,
        editProjectLayer: true,
        createLibraryItem: true
      },
      organization: {
        reestrs: true,
        prikaz_10: true,
        sedDialog: true,
        prikaz_123: true,
        downloadXml: true,
        createProject: true,
        downloadFiles: true,
        dataManagement: true,
        taskManagement: true,
        editProjectLayer: true,
        createLibraryItem: true
      }
    };
  }
}

export const settingsSyntheticController = new SettingsSyntheticController();
