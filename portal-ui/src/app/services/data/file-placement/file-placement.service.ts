import { AxiosError } from 'axios';

import { CrgLayersGroup, CrgLayerType, CrgRasterLayer } from '../../gis/layers/layers.models';
import { createRasterLayer } from '../../gis/layers/layers.service';
import { CrgProject } from '../../gis/projects/projects.models';
import { projectsService } from '../../gis/projects/projects.service';
import { wsService } from '../../ws.service';
import { FileInfo } from '../files/files.models';
import { getFileInfo } from '../files/files.service';
import { getFileBaseName } from '../files/files.util';
import { LibraryRecord } from '../library/library.models';
import { ProcessResponse, ProcessType } from '../processes/processes.models';
import { createFileProcess, createProcess } from '../processes/processes.service';
import { FilePlacementMode } from './file-placement.models';

export async function placeGml(
  fileInfo: FileInfo,
  projectId: number,
  invertedCoordinates: boolean
): Promise<ProcessResponse> {
  return createProcess({
    type: ProcessType.IMPORT,
    payload: {
      wsUiId: wsService.getId(),
      fileId: fileInfo.id,
      projectId,
      invertedCoordinates: invertedCoordinates ?? undefined
    }
  });
}

export async function placeFileWithProjection(
  fileInfo: FileInfo,
  projectId: number,
  crs: string,
  mode = FilePlacementMode.FULL
): Promise<ProcessResponse> {
  return createProcess({
    type: ProcessType.IMPORT,
    payload: {
      wsUiId: wsService.getId(),
      fileId: fileInfo.id,
      projectId,
      mode,
      crs
    }
  });
}

export async function importFeaturesFromShapeFile(
  shape: File,
  datasetId: string,
  tableName: string
): Promise<ProcessResponse> {
  const data = new FormData();

  data.append('file', shape, shape.name);
  data.append(
    'processModelJson',
    JSON.stringify({
      type: ProcessType.IMPORT_GEOMETRY,
      payload: {
        datasetId: datasetId,
        tableName: tableName,
        fileType: 'SHP'
      }
    })
  );

  return createFileProcess(data);
}

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
    files.length > 1
      ? projectsService.createGroup(
          {
            title: document.title || String(document.id),
            enabled: true
          },
          project.id
        )
      : undefined;

  if (creatingGroup) {
    tasks.push(creatingGroup);
  }

  return [
    ...tasks,
    ...files.map(file => placeFile(file, { crs, mode: FilePlacementMode.FULL }, project, document, creatingGroup))
  ];
}

export async function placeFile(
  file: FileInfo,
  fileOptions: FileOptions,
  project: CrgProject,
  document: LibraryRecord,
  layersGroupCreating?: Promise<CrgLayersGroup> | CrgLayersGroup
): Promise<void> {
  const { path, id, title } = await getFileInfo(file.id);
  const group = layersGroupCreating && (await layersGroupCreating);

  const rasterLayer: Omit<CrgRasterLayer, 'id'> = {
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
