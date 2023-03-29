import { Given } from '@wdio/cucumber-framework';

import { PrincipalType, RoleAssignmentBody } from '../../../../src/app/services/data/permissions/permissions.models';
import { setDocLibraryPermissionAsAdmin } from './addDocLibraryPermission';
import { authenticateAs, authenticateAsAdmin } from '../auth/authenticate';
import { getRoleByTitle, getTestUser, testUsers } from '../auth/testUsers';
import { createGeneratedDocuments } from './createGeneratedDocuments';
import { getDocumentsLibraryByTitle } from './getDocLibraryByTitle';
import { getLibraryRecordsAs } from './getLibraryRecordsAs';
import { getUserByEmail } from '../auth/getUserByEmail';
import { ScenarioScope } from '../../ScenarioScope';

Given(
  'в библиотеке документов {string} существует минимум {int} документов, доступных пользователю {string}',
  async function (this: ScenarioScope, libraryTitle: string, docsNumber: number, username: keyof typeof testUsers) {
    const user = getTestUser(username);
    await authenticateAs(user);
    const library = await getDocumentsLibraryByTitle(libraryTitle);

    const [records] = await getLibraryRecordsAs(
      library.table_name,
      library.schemaId,
      {
        page: 0,
        pageSize: docsNumber
      },
      user
    );

    const lack = docsNumber - records.length;
    const generated = await createGeneratedDocuments(lack, library, user);

    this.latestLibraryRecords = [...records, ...generated];
  }
);

Given(
  'у пользователя {string} есть право на {string} на библиотеку документов {string}',
  async (username: string, roleTitle: string, libraryTitle: string) => {
    await authenticateAsAdmin();
    const user = await getUserByEmail(getTestUser(username).email);
    const role = getRoleByTitle(roleTitle);
    const library = await getDocumentsLibraryByTitle(libraryTitle);
    const permission: RoleAssignmentBody = {
      principalId: user.id,
      principalType: PrincipalType.USER,
      role
    };

    await setDocLibraryPermissionAsAdmin(permission, library);
  }
);
