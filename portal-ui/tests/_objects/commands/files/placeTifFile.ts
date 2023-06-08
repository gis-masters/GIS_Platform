import { CrgLayerType, CrgRasterLayer } from '../../../../src/app/services/gis/layers/layers.models';
import { LibraryRecord } from '../../../../src/app/services/data/docLibrary/docLibrary.models';
import { CrgProject } from '../../../../src/app/services/gis/projects/projects.models';
import { layersClient } from '../../../../src/app/services/gis/layers/layers.client';
import { getFileBaseName } from '../../../../src/app/services/data/files/files.util';
import { filesClient } from '../../../../src/app/services/data/files/files.client';
import { FileInfo } from '../../../../src/app/services/data/files/files.models';
import { requestAsAdmin } from '../requestAs';

export async function placeTifFile(
  project: CrgProject,
  record: LibraryRecord,
  file: FileInfo,
  nativeCRS: string
): Promise<void> {
  const { path, id, title } = await requestAsAdmin(filesClient.getFile, file.id);

  if (path) {
    const rasterLayer: CrgRasterLayer = {
      title: getFileBaseName(title),
      type: CrgLayerType.RASTER,
      mode: 'full',
      nativeCRS,
      tableName: `${record.libraryTableName}_${record.id}__${id}`,
      dataSourceUri: `file://${path}`,
      libraryId: record.libraryTableName,
      recordId: record.id,
      parentId: undefined,
      enabled: true
    };

    await requestAsAdmin(layersClient.createLayer, rasterLayer, project.id);
  } else {
    throw new Error('Нет пути к файлу');
  }
}
