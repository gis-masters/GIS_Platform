import { AxiosRequestConfig } from 'axios';

import { libraryRecordPermissionsSyntheticController } from './libraryRecordPermissions.syntheticController';
import { libraryRecordsSyntheticController } from './libraryRecords.syntheticController';
import { libraryRecordSyntheticController } from './libraryRecord.syntheticController';
import { fiasAddressSyntheticController } from './fiasAddress.syntheticController';
import { librariesSyntheticController } from './libraries.syntheticController';
import { fiasOktmoSyntheticController } from './fiasOktmo.syntheticController';
import { projectsSyntheticController } from './projects.syntheticController';
import { librarySyntheticController } from './library.syntheticController';
import { schemasSyntheticController } from './schemas.syntheticController';
import { groupsSyntheticController } from './groups.syntheticController';
import { usersSyntheticController } from './users.syntheticController';

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
  fiasAddressSyntheticController
];

export function selectController(url: string) {
  return controllers.find(({ pattern }) => url.match(pattern));
}
