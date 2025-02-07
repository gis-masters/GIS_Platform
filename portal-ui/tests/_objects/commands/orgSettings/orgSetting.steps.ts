import { Given } from '@wdio/cucumber-framework';

import { CompositeSettings } from '../../../../src/app/stores/OrganizationSettings.store';
import { TestUser } from '../auth/testUsers';
import { getOrgSettingAsSuperAdmin, setOrgSetting } from './setOrgSetting';

Given(
  'пользователем {user} включен пункт {string} в настройках организации',
  async function (user: TestUser, setting: string) {
    const orgSettings = await getOrgSettingAsSuperAdmin(user);
    const settings = updateOrgSettings(setting, true, orgSettings);

    if (settings) {
      await setOrgSetting(settings);
    }
  }
);

Given('в настройках организации {user} отключил пункт {string}', async function (user: TestUser, setting: string) {
  const orgSettings = await getOrgSettingAsSuperAdmin(user);
  const settings = updateOrgSettings(setting, false, orgSettings);

  if (settings) {
    await setOrgSetting(settings);
  }
});

Given(
  'пользователем {user} в настройках организации добавлен тэг {string}',
  async function (user: TestUser, tag: string) {
    const settings = await getTagSetting(user, tag);

    if (settings) {
      await setOrgSetting(settings);
    }
  }
);

function updateOrgSettings(setting: string, status: boolean, compositeSettings?: CompositeSettings) {
  if (!compositeSettings?.organization) {
    return;
  }

  const newSetting = {
    id: compositeSettings.id,
    settings: compositeSettings?.organization
  };

  switch (setting) {
    case 'Управление задачами': {
      newSetting.settings.taskManagement = status;

      break;
    }

    case 'Создание проекта': {
      newSetting.settings.createProject = status;

      break;
    }

    case 'Скачать документ': {
      newSetting.settings.downloadFiles = status;

      break;
    }
  }

  return newSetting;
}

async function getTagSetting(user: TestUser, tag: string): Promise<CompositeSettings | undefined> {
  const orgSettings = await getOrgSettingAsSuperAdmin(user);

  if (orgSettings?.settings) {
    orgSettings?.settings.tags.push(tag);

    return orgSettings;
  }
}
