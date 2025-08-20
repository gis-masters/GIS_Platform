import { authClient } from '../../../../src/app/services/auth/auth/auth.client';
import { RegData } from '../../../../src/app/services/auth/auth/auth.models';
import { organizationsClient } from '../../../../src/app/services/auth/organizations/organizations.client';
import { Organization } from '../../../../src/app/services/auth/organizations/organizations.models';
import { OrgSettings } from '../../../../src/app/stores/OrganizationSettings.store';
import { requestAs } from '../requestAs';
import { getTestUser } from './testUsers';

export async function createOrganization(regData: RegData): Promise<void> {
  const limit = 60;

  const orgId = await authClient.registration(regData);
  for (let i = 0; i < limit; i++) {
    const organization = await requestAs(
      getTestUser('Администратор системы'),
      organizationsClient.getOrganization,
      orgId
    );

    if (organization.status === 'PROVISIONED') {
      if (isBodyNotValid(organization) || isSettingsNotValid(organization.settings)) {
        throw new Error(`Организация: ${organization.id} создана не корректно`);
      }

      return;
    }

    await browser.pause(2000);
  }

  throw new Error(`Не дождаться создания организации "${regData.company}" за ${limit} секунд`);
}

/**
 * Функция проверяет, установлены ли все необходимые свойства организации и содержат ли они допустимые значения,
 * характерные для тестовой организации развернутой с первой специализацией.
 * Это помогает удостовериться, что объект организации корректен и готов к использованию.
 *
 * @param organization Объект организации.
 */
function isBodyNotValid(organization: Organization) {
  return (
    !organization.id ||
    !organization.name ||
    !organization.phone ||
    !organization.createdAt ||
    !organization.groups ||
    !organization.users ||
    organization.users.length < 1 ||
    !organization.settings
  );
}

/**
 * Функция тщательно проверяет, установлены ли все необходимые настройки организации и содержат ли они допустимые
 * значения, характерные для тестовой организации развернутой с первой специализацией.
 * Это помогает обеспечить принцип fail fast.
 *
 * @param settings Настройки организации.
 */
function isSettingsNotValid(settings: OrgSettings): boolean {
  return (
    !settings.downloadXml ||
    !settings.sedDialog ||
    !settings.downloadFiles ||
    !settings.reestrs ||
    !settings.createProject ||
    !settings.createLibraryItem ||
    !settings.showPermissions ||
    !settings.editProjectLayer ||
    !settings.viewDocumentLibrary ||
    !settings.viewBugReport ||
    !settings.downloadGml ||
    !settings.importShp ||
    !settings.viewServicesCalculator ||
    !settings.default_epsg ||
    !settings.favorites_epsg ||
    settings.favorites_epsg.length < 1 ||
    !settings.tags
  );
}
