import { Given } from '@wdio/cucumber-framework';

import {
  PrincipalType,
  Role,
  RoleAssignmentBody
} from '../../../../src/app/services/data/permissions/permissions.models';
import { setDocLibraryPermissionAsAdmin } from './addDocLibraryPermission';
import { authenticateAs, authenticateAsAdmin } from '../auth/authenticate';
import { TestUser } from '../auth/testUsers';
import { createGeneratedDocuments } from './createGeneratedDocuments';
import { getDocumentsLibraryByTitle } from './getDocLibraryByTitle';
import { getLibraryRecordsAs } from './getLibraryRecordsAs';
import { getUserByEmail } from '../auth/getUserByEmail';
import { ScenarioScope } from '../../ScenarioScope';

Given(
  'в библиотеке документов {string} существует минимум {int} документов, доступных пользователю {user}',
  async function (this: ScenarioScope, libraryTitle: string, docsNumber: number, user: TestUser) {
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
  'у пользователя {user} есть право на {role} на библиотеку документов {string}',
  async (user: TestUser, role: Role, libraryTitle: string) => {
    await authenticateAsAdmin();
    const userFromApi = await getUserByEmail(user.email);
    const library = await getDocumentsLibraryByTitle(libraryTitle);
    const permission: RoleAssignmentBody = {
      principalId: userFromApi.id,
      principalType: PrincipalType.USER,
      role
    };

    await setDocLibraryPermissionAsAdmin(permission, library);
  }
);
