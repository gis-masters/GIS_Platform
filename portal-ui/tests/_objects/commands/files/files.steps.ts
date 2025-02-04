import { DataTable } from '@cucumber/cucumber';
import { Given } from '@wdio/cucumber-framework';

import { CompoundMainFiles } from '../../../../src/app/services/data/files/files.models';
import { getFileExtension } from '../../../../src/app/services/data/files/files.util';
import { ScenarioScope } from '../../ScenarioScope';
import { updateLibraryRecord } from '../docLibrary/updateLibraryRecord';
import { placeFile } from './placeFile';
import { uploadTestFile } from './uploadTestFile';

Given('загружен тестовый файл {string}', async function (this: ScenarioScope, fileName: string) {
  const file = await uploadTestFile(fileName);
  this.latestUploadedFile = file;
  this.latestUploadedFiles = [file];
});

Given('загружены тестовые файлы', async function (this: ScenarioScope, table: DataTable) {
  const files = table.raw()[0];

  this.latestUploadedFiles = await Promise.all(
    files.map(async file => {
      return await uploadTestFile(file);
    })
  );

  if (this.latestUploadedFiles.length === 1) {
    this.latestUploadedFile = this.latestUploadedFiles[0];
  }
});

Given('загружены тестовые файлы с названиями: {strings}', async function (filesNames: string[]) {
  const files = await Promise.all(
    filesNames.map(async file => {
      return await uploadTestFile(file);
    })
  );

  this.latestUploadedFiles = files;

  if (files.length === 1) {
    this.latestUploadedFile = files;
  }
});

Given(
  'загруженный тестовый dxf файл в проекции {string} размещен в созданном проекте',
  async function (this: ScenarioScope, crs: string) {
    await placeFile(this.latestUploadedFile, this.latestProject.id, crs);
  }
);

Given(
  'загруженный тестовый shape файл в проекции {string} размещен в созданном проекте',
  async function (this: ScenarioScope, crs: string) {
    const shape = this.latestUploadedFiles.find(file => getFileExtension(file.title) === CompoundMainFiles.SHP);

    if (shape) {
      await placeFile(shape, this.latestProject.id, crs);
    } else {
      throw new Error('no file');
    }
  }
);

Given(
  'загруженный тестовый tab файл в проекции {string} размещен в созданном проекте',
  async function (this: ScenarioScope, crs: string) {
    const tab = this.latestUploadedFiles.find(file => getFileExtension(file.title) === CompoundMainFiles.TAB);

    if (tab) {
      await placeFile(tab, this.latestProject.id, crs);
    } else {
      throw new Error('no file');
    }
  }
);

Given(
  'загруженный тестовый tif файл в проекции {string} размещен в созданном проекте',
  async function (this: ScenarioScope, crs: string) {
    if (this.latestUploadedFile || this.latestUploadedFiles[0]) {
      await placeFile(this.latestUploadedFiles[0] || this.latestUploadedFile, this.latestProject.id, crs);
    } else {
      throw new Error('no file');
    }
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
    const files = this.latestUploadedFiles.length ? this.latestUploadedFiles : [this.latestUploadedFile];

    await updateLibraryRecord(this.latestLibraryRecords[0].libraryTableName, this.latestLibraryRecords[0].id, {
      some_files: files.map(file => {
        return {
          id: file.id,
          title: file.title,
          size: file.size
        };
      })
    });
  }
);
