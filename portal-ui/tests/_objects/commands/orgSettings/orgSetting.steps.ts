import { Given } from '@wdio/cucumber-framework';

import { usersClient } from '../../../../src/app/services/auth/users/users.client';
import {
  CompositeSettings,
  organizationSettings,
  OrgSettings
} from '../../../../src/app/stores/OrganizationSettings.store';
import { requestAsAdmin } from '../requestAs';
import { setOrgSetting, setOrgSettingAsSuperAdmin } from './setOrgSetting';

type orgSettings = {
  id: number;
  settings: OrgSettings;
};

Given('настройка {string} в настройках организации включена', async function (setting: string) {
  await setOrgSetting(await updateOrgSettings(setting, true));
});

Given('в настройках организации отключен пункт {string}', async function (setting: string) {
  await setOrgSetting(await updateOrgSettings(setting, false));
});

Given('в настройках организации добавлен тэг {string}', async function (tag: string) {
  await setOrgSetting(await updateTagSetting(tag));
});

Given('в настройках организации суперадмином добавлен тэг {string}', async function (tag: string) {
  await setOrgSettingAsSuperAdmin(await updateTagSetting(tag));
});

async function getOption(orgName?: string): Promise<orgSettings> {
  const user = await requestAsAdmin(usersClient.getCurrentUser);

  // будет исправлено в #2155
  const settings: OrgSettings = {
    createLibraryItem: true,
    showPermissions: true,
    createProject: true,
    downloadFiles: true,
    viewDocumentLibrary: true,
    viewBugReport: true,
    downloadGml: true,
    importShp: true,
    viewServicesCalculator: true,
    downloadXml: true,
    editProjectLayer: true,
    reestrs: true,
    sedDialog: true,
    taskManagement: true,
    favorites_epsg: [
      '{"authName":"EPSG","authSrid":3857,"srtext":"PROJCS[\\"WGS 84 / Pseudo-Mercator\\",GEOGCS[\\"WGS 84\\",DATUM[\\"WGS_1984\\",SPHEROID[\\"WGS 84\\",6378137,298.257223563,AUTHORITY[\\"EPSG\\",\\"7030\\"]],AUTHORITY[\\"EPSG\\",\\"6326\\"]],PRIMEM[\\"Greenwich\\",0,AUTHORITY[\\"EPSG\\",\\"8901\\"]],UNIT[\\"degree\\",0.0174532925199433,AUTHORITY[\\"EPSG\\",\\"9122\\"]],AUTHORITY[\\"EPSG\\",\\"4326\\"]],PROJECTION[\\"Mercator_1SP\\"],PARAMETER[\\"central_meridian\\",0],PARAMETER[\\"scale_factor\\",1],PARAMETER[\\"false_easting\\",0],PARAMETER[\\"false_northing\\",0],UNIT[\\"metre\\",1,AUTHORITY[\\"EPSG\\",\\"9001\\"]],AXIS[\\"X\\",EAST],AXIS[\\"Y\\",NORTH],EXTENSION[\\"PROJ4\\",\\"+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs\\"],AUTHORITY[\\"EPSG\\",\\"3857\\"]]","proj4Text":"+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs","title":"WGS 84 / Pseudo-Mercator, EPSG:3857, метры","auth_srid":3857}'
    ],
    default_epsg: 'WGS 84 / Pseudo-Mercator, EPSG:3857, метры',
    tags: ['НТО'],
    storageSize: 10,
    favoritesEpsg: [],
    defaultEpsg: ''
  };

  const testOrg = organizationSettings.systemSettings?.find(org => org.name === orgName);

  let id: number = user.orgId;

  if (testOrg) {
    id = testOrg.id;
  }

  const payload: { id: number; settings: OrgSettings } = {
    id,
    settings
  };

  return payload;
}

async function updateOrgSettings(setting: string, status: boolean) {
  const payload = await getOption();

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

  return payload;
}

async function updateTagSetting(tag: string): Promise<CompositeSettings> {
  const payload = await getOption('Hogwarts 1');
  payload.settings.tags.push(tag);

  return payload;
}
