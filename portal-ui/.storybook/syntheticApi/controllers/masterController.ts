import { AxiosRequestConfig } from 'axios';

import { libraryRecordPermissionsSyntheticController } from './data/libraryRecordPermissions.syntheticController';
import { libraryRecordsSyntheticController } from './data/libraryRecords.syntheticController';
import { libraryRecordSyntheticController } from './data/libraryRecord.syntheticController';
import { fiasAddressSyntheticController } from './data/fiasAddress.syntheticController';
import { librariesSyntheticController } from './data/libraries.syntheticController';
import { fiasOktmoSyntheticController } from './data/fiasOktmo.syntheticController';
import { projectsSyntheticController } from './gis/projects.syntheticController';
import { librarySyntheticController } from './data/library.syntheticController';
import { schemasSyntheticController } from './data/schemas.syntheticController';
import { groupsSyntheticController } from './auth/groups.syntheticController';
import { usersSyntheticController } from './auth/users.syntheticController';
import { settingsSyntheticController } from './auth/settings.syntheticController';
import { settingsSchemaSyntheticController } from './auth/settings-schema.syntheticController';

export interface SyntheticController {
  pattern: RegExp;
  get?(config: AxiosRequestConfig): unknown;
  post?(config: AxiosRequestConfig): unknown;
  put?(config: AxiosRequestConfig): unknown;
  patch?(config: AxiosRequestConfig): unknown;
  delete?(config: AxiosRequestConfig): unknown;
}

const controllers: SyntheticController[] = [
  librarySyntheticController,
  librariesSyntheticController,
  libraryRecordSyntheticController,
  libraryRecordPermissionsSyntheticController,
  libraryRecordsSyntheticController,
  projectsSyntheticController,
  schemasSyntheticController,
  groupsSyntheticController,
  usersSyntheticController,
  fiasOktmoSyntheticController,
  fiasAddressSyntheticController,
  settingsSyntheticController,
  settingsSchemaSyntheticController
];

export function selectController(url: string) {
  return controllers.find(({ pattern }) => url.match(pattern));
}
