import { Given } from '@wdio/cucumber-framework';

import { uploadTestFile } from './uploadTestFile';
import { ScenarioScope } from '../../ScenarioScope';

Given('загружен тестовый файл {string}', async function (this: ScenarioScope, fileName: string) {
  this.latestUploadedFile = await uploadTestFile(fileName);
});
