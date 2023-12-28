import React, { FC } from 'react';
import { observer } from 'mobx-react';

import { sidebars } from '../../stores/Sidebars.store';
import { Carousel } from '../Carousel/Carousel';

export const PhotoModePreviewer: FC = observer(
  () =>
    sidebars.photoLayerOpen &&
    !!sidebars.imagesForPhotoMode.length && (
      <Carousel
        startingImageForPreview={sidebars.imagesForPhotoMode[0]}
        images={sidebars.imagesForPhotoMode}
        onClose={sidebars.closePhotoModePreviewer}
        open={sidebars.photoLayerOpen}
      />
    )
);
