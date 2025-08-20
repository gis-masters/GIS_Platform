import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import Helmet from 'react-helmet';

import { Favicon } from '../../../app/components/Favicon/Favicon';
import { Loading } from '../../../app/components/Loading/Loading';
import { usersService } from '../../../app/services/auth/users/users.service';
import { PhotoUploaderScreens, photoUploaderStore } from '../../stores/PhotoUploader.store';
import { UpActions } from '../UpActions/UpActions';
import { UpAuth } from '../UpAuth/UpAuth';
import { UpHeader } from '../UpHeader/UpHeader';
import { UpLayersList } from '../UpLayersList/UpLayersList';
import { UpLoader } from '../UpLoader/UpLoader';
import { UpLoadResult } from '../UpLoadResult/UpLoadResult';
import { UpMain } from '../UpMain/UpMain';
import { UpPhotoList } from '../UpPhotoList/UpPhotoList';

import '!style-loader!css-loader!sass-loader!./PhotoUploader.scss';

const cnPhotoUploader = cn('PhotoUploader');

const PhotoUploader: FC = observer(() => {
  useEffect(() => {
    window.addEventListener('load', async () => {
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('/sw.js');
        } catch {
          console.error('ServiceWorker Register fail');
        }
      }
    });
    void usersService.fetchCurrentUser();
  }, []);

  return (
    <div className={cnPhotoUploader()}>
      <Helmet>
        <link rel='manifest' href='assets/manifest.json' />
        <meta name='theme-color' content='#edf1f5' />
        <link type='image/x-icon' rel='icon' href='assets/images/manifestIcons/manifest-icon.ico' />
        <link rel='shortcut icon' href='assets/images/manifestIcons/manifest-icon.ico' />
        <link rel='icon' href='assets/images/manifestIcons/manifest-icon.ico' />
        <link rel='apple-touch-icon' sizes='1024x1024' href='assets/images/manifestIcons/ios/1024.png' />
        <link rel='apple-touch-startup-image' href='assets/images/manifestIcons/ios/180.png' />
        <link rel='apple-touch-icon' sizes='192x192' href='assets/images/manifestIcons/ios/192.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='assets/images/manifestIcons/ios/180.png' />
        <link rel='apple-touch-icon' sizes='152x152' href='assets/images/manifestIcons/ios/152.png' />
        <link rel='apple-touch-icon' sizes='167x167' href='assets/images/manifestIcons/ios/167.png' />
        <link rel='apple-touch-icon' sizes='120x120' href='assets/images/manifestIcons/ios/120.png' />
        <link rel='apple-touch-icon' href='assets/images/manifestIcons/ios/32.png' />
        <meta name='apple-mobile-web-app-title' content='Загрузка фотографий' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />
      </Helmet>
      <Favicon />
      {photoUploaderStore.currentScreen === PhotoUploaderScreens.BUSY && <Loading global />}
      {photoUploaderStore.currentScreen === PhotoUploaderScreens.AUTH && <UpAuth />}
      {photoUploaderStore.currentScreen !== PhotoUploaderScreens.AUTH && (
        <>
          <Loading global visible={photoUploaderStore.busy} />
          <UpHeader />
        </>
      )}
      <div className={cnPhotoUploader('Container ')}>
        {photoUploaderStore.currentScreen === PhotoUploaderScreens.LAYERS_LIST && <UpLayersList />}
        {photoUploaderStore.currentScreen === PhotoUploaderScreens.MAIN && (
          <>
            <UpMain />
            <UpActions />
          </>
        )}
        {photoUploaderStore.currentScreen === PhotoUploaderScreens.PHOTO_LIST && !!photoUploaderStore.files.length && (
          <UpPhotoList />
        )}
        {photoUploaderStore.currentScreen === PhotoUploaderScreens.LOADER && !!photoUploaderStore.files.length && (
          <UpLoader />
        )}
        {photoUploaderStore.currentScreen === PhotoUploaderScreens.UPLOAD_RESULT && photoUploaderStore.uploadResult && (
          <UpLoadResult />
        )}
      </div>
    </div>
  );
});

export default PhotoUploader;
