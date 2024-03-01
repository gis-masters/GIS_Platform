import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { PhotoUploaderScreens, photoUploaderStore } from '../../stores/PhotoUploader.store';
import { Favicon } from '../../../app/components/Favicon/Favicon';
import { Loading } from '../../../app/components/Loading/Loading';

import { UpAuth } from '../UpAuth/UpAuth';
import { UpHeader } from '../UpHeader/UpHeader';
import { UpMain } from '../UpMain/UpMain';
import { UpActions } from '../UpActions/UpActions';
import { UpLayersList } from '../UpLayersList/UpLayersList';

import '!style-loader!css-loader!sass-loader!./PhotoUploader.scss';

const cnPhotoUploader = cn('PhotoUploader');

const PhotoUploader: FC = observer(() => (
  <div className={cnPhotoUploader()}>
    <Favicon />
    {photoUploaderStore.currentScreen === PhotoUploaderScreens.AUTH && <UpAuth />}
    {photoUploaderStore.currentScreen !== PhotoUploaderScreens.AUTH && (
      <>
        <Loading global visible={photoUploaderStore.busy} />
        <UpHeader />
      </>
    )}
    {photoUploaderStore.currentScreen === PhotoUploaderScreens.LAYERSLIST && <UpLayersList />}
    {photoUploaderStore.currentScreen === PhotoUploaderScreens.MAIN && (
      <>
        <UpMain />
        <UpActions />
      </>
    )}
  </div>
));

export default PhotoUploader;
