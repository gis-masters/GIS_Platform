import React, { type FC, useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { type FileInfo } from '../../services/data/files/files.models';
import { getPhotoModeFeatureFiles } from '../../services/data/files/files.util';
import {
  extractFeatureId,
  extractResourceIdFromFeatureId
} from '../../services/geoserver/featureType/featureType.util';
import { type WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { getLayerSchema } from '../../services/gis/layers/layers.service';
import { currentProject } from '../../stores/CurrentProject.store';
import { sidebars } from '../../stores/Sidebars.store';
import { Carousel, type CarouselImageInfo } from '../Carousel/Carousel';
import { getFeaturesListItemTitle } from '../FeaturesListItem/FeaturesListItem.util';
import { TextBadge } from '../TextBadge/TextBadge';

const cnPhotoModePreviewer = cn('PhotoModePreviewer');

async function buildCarouselImageForPhotoFile(feature: WfsFeature, file: FileInfo): Promise<CarouselImageInfo> {
  const tableName = extractResourceIdFromFeatureId(feature.id);
  const layer =
    currentProject.getLayerByResourceIdFromAllVectorableLayers(tableName) ||
    currentProject.getLayerByResourceIdFromVisibleVectorLayers(tableName);

  const schema = await getLayerSchema(layer);

  return {
    file,
    title: (
      <>
        <span className={cnPhotoModePreviewer('Annotation')}>
          из объекта: {getFeaturesListItemTitle(feature, schema).title}
        </span>

        <TextBadge id={extractFeatureId(feature.id)} />
      </>
    ),
    subTitle: file.title
  };
}

function collectPhotoModeCarouselPromises(features: WfsFeature[]): Array<Promise<CarouselImageInfo>> {
  const promises: Array<Promise<CarouselImageInfo>> = [];
  for (const feature of features) {
    for (const file of getPhotoModeFeatureFiles(feature)) {
      promises.push(buildCarouselImageForPhotoFile(feature, file));
    }
  }

  return promises;
}

type PhotoModePreviewerStore = {
  data: CarouselImageInfo[] | undefined;
  hasError: string | undefined;
  setData(data: CarouselImageInfo[] | undefined): void;
  setError(error: string | undefined): void;
};

export const PhotoModePreviewer: FC = observer(() => {
  const store: PhotoModePreviewerStore = useLocalObservable(() => ({
    data: undefined,
    hasError: undefined,
    setData(this: PhotoModePreviewerStore, data: CarouselImageInfo[] | undefined): void {
      this.data = data;
    },
    setError(this: PhotoModePreviewerStore, hasError: string | undefined): void {
      this.hasError = hasError;
    }
  }));

  const { data, setData, hasError, setError } = store;
  const features = sidebars.featuresForPhotoMode;

  useEffect(() => {
    void (async () => {
      try {
        const filesWithFeatures = await Promise.all(collectPhotoModeCarouselPromises(features));

        if (filesWithFeatures.length === 0) {
          setError('Ошибка загрузки файлов');
        } else {
          setError(undefined);
        }

        setData(filesWithFeatures);
      } catch {
        setError('Ошибка загрузки файлов');
        setData(undefined);
      }
    })();
  }, [setData, setError, features]);

  return (
    sidebars.photoLayerOpen &&
    !!data?.length && (
      <Carousel
        images={data}
        onClose={sidebars.closePhotoModePreviewer}
        open={sidebars.photoLayerOpen}
        error={hasError}
      />
    )
  );
});
