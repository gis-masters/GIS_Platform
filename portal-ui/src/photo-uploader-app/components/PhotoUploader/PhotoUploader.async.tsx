import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { PhotoUploaderScreens, photoUploaderStore } from '../../stores/PhotoUploader.store';
import { Auth } from '../Auth/Auth';
import { Header } from '../Header/Header';
import { Main } from '../Main/Main';

import '!style-loader!css-loader!sass-loader!./PhotoUploader.scss';

const cnPhotoUploader = cn('PhotoUploader');

const PhotoUploader: FC = observer(() => (
  <div className={cnPhotoUploader()}>
    {photoUploaderStore.currentScreen === PhotoUploaderScreens.AUTH && <Auth />}
    {photoUploaderStore.currentScreen === PhotoUploaderScreens.MAIN && (
      <>
        <Header />
        <Main />
      </>
    )}
  </div>
));

export default PhotoUploader;
