import { type AxiosRequestConfig } from 'axios';

import { groupsSyntheticController } from './auth/groups.syntheticController';
import { settingsSyntheticController } from './auth/settings.syntheticController';
import { settingsSchemaSyntheticController } from './auth/settings-schema.syntheticController';
import { usersSyntheticController } from './auth/users.syntheticController';
import { datasetSyntheticController } from './data/dataset.syntheticController';
import { datasetsSyntheticController } from './data/datasets.syntheticController';
import { datasetTableSyntheticController } from './data/datasetTable.syntheticController';
import { datasetTablesSyntheticController } from './data/datasetTables.syntheticController';
import { fiasAddressSyntheticController } from './data/fiasAddress.syntheticController';
import { fiasOktmoSyntheticController } from './data/fiasOktmo.syntheticController';
import { librariesSyntheticController } from './data/libraries.syntheticController';
import { librarySyntheticController } from './data/library.syntheticController';
import { libraryRecordSyntheticController } from './data/libraryRecord.syntheticController';
import { libraryRecordPermissionsSyntheticController } from './data/libraryRecordPermissions.syntheticController';
import { libraryRecordsSyntheticController } from './data/libraryRecords.syntheticController';
import { schemasSyntheticController } from './data/schemas.syntheticController';
import { schemaTemplatesSyntheticController } from './data/schemaTemplates.syntheticController';
import { srsSyntheticController } from './data/srs.syntheticController';
import { permissionsSyntheticController } from './gis/permissions.syntheticController';
import { projectSyntheticController } from './gis/project.syntheticController';
import { projectsSyntheticController } from './gis/projects.syntheticController';
import { relatedLayersSyntheticController } from './gis/relatedLayers.syntheticController';

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
  datasetTableSyntheticController,
  datasetTablesSyntheticController,
  datasetSyntheticController,
  datasetsSyntheticController,
  schemaTemplatesSyntheticController,
  relatedLayersSyntheticController,
  permissionsSyntheticController,
  projectSyntheticController,
  projectsSyntheticController,
  schemasSyntheticController,
  srsSyntheticController,
  groupsSyntheticController,
  usersSyntheticController,
  fiasOktmoSyntheticController,
  fiasAddressSyntheticController,
  settingsSyntheticController,
  settingsSchemaSyntheticController
];

export function selectController(url: string): SyntheticController | undefined {
  return controllers.find(({ pattern }) => pattern.exec(url));
}
