import { Given, When } from '@wdio/cucumber-framework';

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
import { createFolder } from './createFolder';
import { addRecordPermissions } from './addRecordPermissions';
import { moveLibraryRecord } from './moveLibraryRecord';
import { createLibrary } from './createLibrary';
import { deleteAllLibraryRecordInLibrary } from './deleteLibraryRecords';
import { createLibraryRecordAsAdmin } from './createLibraryRecordAs';
import { updateLibraryRecord } from './updateLibraryRecord';
import { ExplorerBlock } from '../../blocks/Explorer/Explorer.block';
import { documentVersionsWidgetBlock } from '../../blocks/DocumentVersionsWidget/DocumentVersionsWidget.block';

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
  'в созданной папке в библиотеке документов {string} существует документ, доступный пользователю {user}',
  async function (this: ScenarioScope, libraryTitle: string, user: TestUser) {
    await authenticateAs(user);
    const library = await getDocumentsLibraryByTitle(libraryTitle);
    const generated = await createGeneratedDocuments(1, library, user);

    await moveLibraryRecord(library.table_name, generated[0], this.latestFolder);

    this.latestLibraryRecords = generated;
  }
);

Given(
  'в библиотеке документов {string} существует документ с контент типом {string} c полем `Название` равным {string}, доступный пользователю {user}',
  async function (this: ScenarioScope, libraryTitle: string, contentType: string, fieldValue: string, user: TestUser) {
    await authenticateAs(user);

    const library = await getDocumentsLibraryByTitle(libraryTitle);
    const record = await createLibraryRecordAsAdmin(
      {
        title: fieldValue,
        content_type_id: contentType
      },
      library.table_name
    );
    this.latestLibraryRecords = [record];
  }
);

Given('все документы в библиотеке {string} удалены', async function (libraryTitle: string) {
  await deleteAllLibraryRecordInLibrary(libraryTitle);
});

Given(
  'в библиотеке документов {string} существует папка {string} с типом {string}, доступная пользователю {user}',
  async function (
    this: ScenarioScope,
    libraryTitle: string,
    folderName: string,
    contentTypeId: string,
    user: TestUser
  ) {
    await authenticateAs(user);
    const library = await getDocumentsLibraryByTitle(libraryTitle);
    const record = await createFolder(library, folderName, contentTypeId);

    this.latestFolder = record;
  }
);

Given(
  'в библиотеке документов {string} у пользователя {user} есть право на {role} на созданную папку',
  async function (this: ScenarioScope, libraryTitle: string, user: TestUser, role: Role) {
    await authenticateAs(user);
    const library = await getDocumentsLibraryByTitle(libraryTitle);
    const currentUser = await getUserByEmail(user.email);

    await addRecordPermissions(
      { role, principalId: currentUser.id, principalType: PrincipalType.USER },
      this.latestFolder.id,
      library.table_name
    );
  }
);

Given(
  'в библиотеке документов {string} у пользователя {user} есть право на {role} на созданный документ',
  async function (this: ScenarioScope, libraryTitle: string, user: TestUser, role: Role) {
    await authenticateAsAdmin();
    const library = await getDocumentsLibraryByTitle(libraryTitle);
    const currentUser = await getUserByEmail(user.email);

    await addRecordPermissions(
      { role, principalId: currentUser.id, principalType: PrincipalType.USER },
      this.latestLibraryRecords[0].id,
      library.table_name
    );
  }
);

Given(
  'существует библиотека {string} документов по заготовленной схеме с включенным версионированием',
  async function (this: ScenarioScope, title: string) {
    await createLibrary(this.latestSchema, title, true);
  }
);

Given(
  'существует библиотека {string} документов по заготовленной схеме без версионирования',
  async function (this: ScenarioScope, title: string) {
    await createLibrary(this.latestSchema, title, false);
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

Given(
  'в созданной библиотеке у созданного документа я изменяю поле {string} на {string}',
  async function (this: ScenarioScope, field: string, value: string) {
    if (this.latestSchema.tableName) {
      await updateLibraryRecord(this.latestSchema.tableName, this.latestLibraryRecords[0].id, {
        [field]: value
      });

      this.latestLibraryRecords[0].title = value;
    }
  }
);

When(
  'в библиотеке документов у созданного документа я нажимаю на кнопку `Версии документа`',
  async function (this: ScenarioScope) {
    const explorerBlock = new ExplorerBlock();
    if (this.latestLibraryRecords[0].title) {
      await explorerBlock.selectExplorerItem(this.latestLibraryRecords[0].title);
      await documentVersionsWidgetBlock.clickDocumentVersionBtn();
    } else {
      throw new Error('Нет документов в библиотеке');
    }
  }
);

When('в библиотеке документов у созданного документа поле {string} пустое', async function (field: string) {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.waitForExist();

  await expect(await explorerBlock.getContentWidgetFieldValue(field)).toEqual('—');
});
