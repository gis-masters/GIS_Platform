import * as ExifReader from 'exifreader';

import { createFile } from '../../app/services/data/files/files.service';
import { defaultOlProjectionCode } from '../../app/services/data/projections/projections.models';
import { getProjectionByCode } from '../../app/services/data/projections/projections.service';
import { createFeature } from '../../app/services/data/vectorData/vectorData.service';
import { GeometryType, NewWfsFeature } from '../../app/services/geoserver/wfs/wfs.models';
import { transformGeometry } from '../../app/services/util/coordinates-transform.util';
import { formatDate, systemFormat } from '../../app/services/util/date.util';
import { currentUser } from '../../app/stores/CurrentUser.store';
import { PhotoUploaderScreens, photoUploaderStore } from '../stores/PhotoUploader.store';
import { UploadedFile, UploadedFileStatus } from './photoUploader.models';

export interface UploadResultType {
  handled: number;
  succeeded: number;
  withError: number;
}

interface PhotoFeatureData {
  datasetId: string;
  vectorTableId: string;
  feature: NewWfsFeature;
}

const defaultRotation = 1800;

function getUploadingResult() {
  return {
    handled: photoUploaderStore.filesHandled,
    succeeded: photoUploaderStore.filesSucceeded,
    withError: photoUploaderStore.filesWithError
  };
}

async function createPhotoFeature({ datasetId, vectorTableId, feature }: PhotoFeatureData): Promise<void> {
  if (
    feature.geometry &&
    photoUploaderStore.checkedLayer?.data.crs &&
    photoUploaderStore.checkedLayer?.data.crs !== defaultOlProjectionCode
  ) {
    const currentProjection = await getProjectionByCode(defaultOlProjectionCode);
    const newProjection = await getProjectionByCode(photoUploaderStore.checkedLayer?.data.crs);

    if (newProjection && currentProjection) {
      feature.geometry = transformGeometry(feature.geometry, currentProjection, newProjection);
    }
  }

  await createFeature(datasetId, vectorTableId, feature);
}

export async function uploadPhotos(): Promise<void> {
  photoUploaderStore.setReturnButtonBusy(true);
  for (const item of photoUploaderStore.files) {
    if (!photoUploaderStore.canUploading) {
      break;
    }

    if (item.status) {
      continue;
    }

    item.status = UploadedFileStatus.PENDING;
    photoUploaderStore.updateFile(item);

    try {
      const loadToServer = await createFile(item.file);

      if (!loadToServer) {
        item.status = UploadedFileStatus.ERROR;
        photoUploaderStore.updateFile(item);

        continue;
      }

      const { labelValue } = photoUploaderStore;
      item.feature.properties.label = labelValue === '' ? null : labelValue;

      item.feature.properties.photo = [
        {
          id: loadToServer.id,
          size: loadToServer.size,
          title: loadToServer.title
        }
      ];

      const vectorTableIdentifier: string | undefined = photoUploaderStore.checkedLayer?.data.identifier;
      const datasetIdentifier = photoUploaderStore.checkedLayer?.data.dataset;

      if (vectorTableIdentifier && datasetIdentifier) {
        const photoFeatureData: PhotoFeatureData = {
          datasetId: datasetIdentifier,
          vectorTableId: vectorTableIdentifier,
          feature: item.feature
        };

        await createPhotoFeature(photoFeatureData);
      }
    } catch {
      item.status = UploadedFileStatus.ERROR;
      photoUploaderStore.updateFile(item);

      continue;
    }

    item.status = UploadedFileStatus.SUCCESS;
    photoUploaderStore.updateFile(item);
  }

  photoUploaderStore.setReturnButtonBusy(false);

  const uploadResult = getUploadingResult();

  if (photoUploaderStore.files.length === uploadResult.handled) {
    photoUploaderStore.setUploadResult(uploadResult);
    photoUploaderStore.setCurrentScreen(PhotoUploaderScreens.UPLOAD_RESULT);
  }
}

export async function getFilesInfoByFileList(files: File[]): Promise<UploadedFile[]> {
  return Promise.all(
    files.map(async file => ({
      title: file.name,
      file,
      size: file.size,
      url: URL.createObjectURL(file),
      feature: await getMetaData(file),
      status: null
    }))
  );
}

export async function getMetaData(file: File): Promise<NewWfsFeature> {
  let tags: ExifReader.ExpandedTags | null = null;

  try {
    tags = await ExifReader.load(file, { expanded: true, async: true });
  } catch {
    //do nothing
  }

  const photoTime = tags?.exif?.DateTime?.description
    ? `${tags.exif?.DateTime?.description.slice(0, 4)}-${tags?.exif?.DateTime?.description.slice(5, 7)}-${tags?.exif?.DateTime?.description.slice(8, 10)}`
    : formatDate(file.lastModified, systemFormat);

  const longitude =
    !!tags?.exif?.GPSLongitude?.description && !Number.isNaN(Number(tags?.exif?.GPSLongitude.description))
      ? (Number(tags.exif?.GPSLongitude.description) * 20_037_508.34) / 180
      : null;

  const latitude =
    !!tags?.exif?.GPSLatitude?.description && !Number.isNaN(Number(tags?.exif?.GPSLatitude.description))
      ? ((Math.log(Math.tan(((90 + Number(tags?.exif?.GPSLatitude.description)) * Math.PI) / 360)) / (Math.PI / 180)) *
          20_037_508.34) /
        180
      : null;

  return {
    geometry:
      longitude && latitude
        ? {
            type: GeometryType.POINT,
            coordinates: longitude && latitude ? [longitude, latitude] : []
          }
        : undefined,

    type: 'Feature',
    properties: {
      photo: [],
      creation_time: formatDate(new Date(), systemFormat),
      name: file.name,
      photography_time: photoTime,
      sender: currentUser.id,
      user_fill_color: '555555',
      user_stroke_color: '555555',
      label_fill_color: '555555',
      label_stroke_color: '555555',
      rotation:
        !!tags?.exif?.GPSImgDirection?.description && !Number.isNaN(Number(tags.exif?.GPSImgDirection.description))
          ? Number(tags.exif?.GPSImgDirection.description)
          : defaultRotation
    }
  };
}

export function getCoordinatesByFeature(feature: NewWfsFeature): string | null {
  if (!feature.geometry) {
    return null;
  }

  return feature.geometry?.coordinates.length
    ? `${feature.geometry.coordinates[0] as number} ${feature.geometry.coordinates[1] as number}`
    : null;
}
