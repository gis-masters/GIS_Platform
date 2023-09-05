import { Given } from '@wdio/cucumber-framework';

import { setOrgSetting } from './setOrgSetting';
import { OrgSettings } from '../../../../src/app/stores/OrganizationSettings.store';
import { usersClient } from '../../../../src/app/services/auth/users/users.client';
import { requestAsAdmin } from '../requestAs';

Given('настройка {string} в настройках организации включена', async function (setting: string) {
  await setOrgSetting(await setOption(setting, true));
});

Given('в настройках организации отключен пункт {string}', async function (setting: string) {
  await setOrgSetting(await setOption(setting, false));
});

async function setOption(setting: string, status: boolean): Promise<OrgSettings> {
  const user = await requestAsAdmin(usersClient.getCurrentUser);

  const payload: OrgSettings = {
    id: user.orgId,
    settings: {
      createLibraryItem: true,
      createProject: true,
      dataManagement: true,
      downloadFiles: true,
      downloadXml: true,
      editProjectLayer: true,
      reestrs: true,
      sedDialog: true,
      taskManagement: true
    }
  };

  if (payload.settings) {
    switch (setting) {
      case 'Управление задачами': {
        payload.settings.taskManagement = status;

        break;
      }

      case 'Создание проекта': {
        payload.settings.createProject = status;

        break;
      }

      case 'Скачать документ': {
        payload.settings.downloadFiles = status;

        break;
      }
    }
  }

  return payload;
}
