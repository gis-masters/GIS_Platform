import React, { FC, useEffect } from 'react';
import { cn } from '@bem-react/classname';
import { observer, useLocalObservable } from 'mobx-react';

import { extractFeatureId, extractFeatureTableName } from '../../services/geoserver/feature.util';
import { currentProject } from '../../stores/CurrentProject.store';
import { getLayerSchema } from '../../services/gis/layers/layers.service';
import { getPhotoModeFeatureFiles } from '../../services/data/files/files.util';
import { sidebars } from '../../stores/Sidebars.store';
import { getFeaturesListItemTitle } from '../FeaturesListItem/FeaturesListItem.util';

import { TextBadge } from '../TextBadge/TextBadge';
import { Carousel, CarouselImageInfo } from '../Carousel/Carousel';

const cnPhotoModePreviewer = cn('PhotoModePreviewer');

type PhotoModePreviewerStore = {
  data: CarouselImageInfo[] | undefined;
  hasError: string | undefined;
  setData(data: CarouselImageInfo[]): void;
  setError(error: string): void;
};

export const PhotoModePreviewer: FC = observer(() => {
  const store: PhotoModePreviewerStore = useLocalObservable(() => ({
    data: undefined,
    isLoading: false,
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
      const filesWithFeatures: CarouselImageInfo[] = await Promise.all(
        features.flatMap(feature => {
          return getPhotoModeFeatureFiles(feature).map(async file => {
            const tableName = extractFeatureTableName(feature.id);
            const layer =
              currentProject.getLayerByTableNameFromAllVectorLayers(tableName) ||
              currentProject.getLayerByTableNameFromVisibleVectorLayers(tableName);

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
          });
        })
      );
      if (!filesWithFeatures) {
        setError('Ошибка загрузки файлов');
      }
      setData(filesWithFeatures);
    })();
  }, [setData, setError, features]);

  return (
    sidebars.photoLayerOpen &&
    !!data.length && (
      <Carousel
        images={data}
        onClose={sidebars.closePhotoModePreviewer}
        open={sidebars.photoLayerOpen}
        error={hasError}
      />
    )
  );
});
