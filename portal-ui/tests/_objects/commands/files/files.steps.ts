import { Given } from '@wdio/cucumber-framework';
import { DataTable } from '@cucumber/cucumber';

import { uploadTestFile } from './uploadTestFile';
import { ScenarioScope } from '../../ScenarioScope';

import { placeDxfFile } from './placeDxfFile';
import { placeTifFile } from './placeTifFile';
import { updateLibraryRecord } from '../docLibrary/updateLibraryRecord';

Given('загружен тестовый файл {string}', async function (this: ScenarioScope, fileName: string) {
  this.latestUploadedFile = await uploadTestFile(fileName);
});

Given('загружены тестовые файлы', async function (this: ScenarioScope, table: DataTable) {
  const files = table.raw()[0];

  this.latestUploadedFiles = await Promise.all(
    files.map(async file => {
      return await uploadTestFile(file);
    })
  );
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
  'из созданного документа удалены все файлы для поля {string}',
  async function (this: ScenarioScope, field: string) {
    await updateLibraryRecord(this.latestLibraryRecords[0].libraryTableName, this.latestLibraryRecords[0].id, {
      [field]: []
    });
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

Given(
  'загруженные тестовые файлы размещены в созданном документе тестовой библиотеки',
  async function (this: ScenarioScope) {
    await updateLibraryRecord(this.latestLibraryRecords[0].libraryTableName, this.latestLibraryRecords[0].id, {
      some_files: this.latestUploadedFiles.map(file => {
        return {
          id: file.id,
          title: file.title,
          size: file.size
        };
      })
    });
  }
);
