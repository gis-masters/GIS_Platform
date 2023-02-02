import { AxiosError } from 'axios';

import { CrgLayersGroup, CrgLayerType, CrgProject, CrgRasterLayer, FilePlacementMode } from './projects.models';
import { createRasterLayer } from './layers.service';
import { LibraryRecord } from '../data/doc-library.service';
import { projectsService } from './projects.service';
import { FileInfo, getFile } from '../data/files.service';
import { getFileBaseName } from '../data/files.util';

interface FileOptions {
  crs: string;
  mode: FilePlacementMode;
}

export function placeFiles(
  files: FileInfo[],
  crs: string,
  project: CrgProject,
  document: LibraryRecord
): Promise<unknown>[] {
  const tasks: Promise<unknown>[] = [];
  const creatingGroup =
    files.length > 1 ? projectsService.createGroup({ title: document.title, enabled: true }, project.id) : undefined;

  if (creatingGroup) {
    tasks.push(creatingGroup);
  }

  return [...tasks, ...files.map(file => placeFile(file, { crs, mode: 'full' }, project, document, creatingGroup))];
}

export async function placeFile(
  file: FileInfo,
  fileOptions: FileOptions,
  project: CrgProject,
  document: LibraryRecord,
  layersGroupCreating?: Promise<CrgLayersGroup> | CrgLayersGroup
): Promise<void> {
  const { path, id, title } = await getFile(file.id);
  const group = layersGroupCreating && (await layersGroupCreating);

  const rasterLayer: CrgRasterLayer = {
    title: getFileBaseName(title),
    type: CrgLayerType.RASTER,
    mode: fileOptions.mode,
    nativeCRS: fileOptions.crs,
    tableName: `${document.libraryTableName}_${document.id}__${id}`,
    dataSourceUri: 'file://' + path,
    libraryId: document.libraryTableName,
    recordId: document.id,
    parentId: group?.id,
    enabled: true
  };

  try {
    await createRasterLayer(rasterLayer, project.id);
  } catch (error) {
    const err = error as AxiosError;

    if (err.response?.status !== 409) {
      throw err;
    }
  }
}
