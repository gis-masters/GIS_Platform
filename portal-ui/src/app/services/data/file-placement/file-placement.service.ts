import { AxiosError } from 'axios';

import { CrgLayersGroup, CrgLayerType, CrgRasterLayer } from '../../gis/layers/layers.models';
import { CrgProject } from '../../gis/projects/projects.models';
import { createFileProcess, createProcess } from '../processes/processes.service';
import { ProcessResponse, ProcessType } from '../processes/processes.models';
import { LibraryRecord } from '../docLibrary/docLibrary.models';
import { createRasterLayer } from '../../gis/layers/layers.service';
import { projectsService } from '../../gis/projects/projects.service';
import { getFileBaseName } from '../files/files.util';
import { FileInfo } from '../files/files.models';
import { getFile } from '../files/files.service';
import { wsService } from '../../ws.service';

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
      projectId: projectId,
      invertedCoordinates: invertedCoordinates ?? undefined
    }
  });
}

export async function placeDxf(fileInfo: FileInfo, projectId: number, crs: string): Promise<ProcessResponse> {
  return createProcess({
    type: ProcessType.IMPORT,
    payload: {
      wsUiId: wsService.getId(),
      fileId: fileInfo.id,
      projectId,
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
        fileType: 'GEOMETRY_FROM_SHAPE'
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
