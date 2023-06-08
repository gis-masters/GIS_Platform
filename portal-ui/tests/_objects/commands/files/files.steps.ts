import { Given } from '@wdio/cucumber-framework';

import { uploadTestFile } from './uploadTestFile';
import { ScenarioScope } from '../../ScenarioScope';

import { placeDxfFile } from './placeDxfFile';
import { placeTifFile } from './placeTifFile';
import { updateLibraryRecord } from '../docLibrary/updateLibraryRecord';

Given('загружен тестовый файл {string}', async function (this: ScenarioScope, fileName: string) {
  this.latestUploadedFile = await uploadTestFile(fileName);
});

Given(
  'загруженный тестовый dxf файл в проекции {string} размещен в созданном проекте',
  async function (this: ScenarioScope, crs: string) {
    await placeDxfFile(this.latestUploadedFile, this.latestProject.id, crs);
  }
);

Given(
  'загруженный тестовый tif файл в проекции {string} размещен в созданном проекте',
  async function (this: ScenarioScope, crs: string) {
    await placeTifFile(this.latestProject, this.latestLibraryRecords[0], this.latestUploadedFile, crs);
  }
);

Given(
  'загруженный тестовый файл размещен в созданном документе тестовой библиотеки',
  async function (this: ScenarioScope) {
    await updateLibraryRecord(this.latestLibraryRecords[0].libraryTableName, this.latestLibraryRecords[0].id, {
      some_files: [
        { id: this.latestUploadedFile.id, title: this.latestUploadedFile.title, size: this.latestUploadedFile.size }
      ]
    });
  }
);
