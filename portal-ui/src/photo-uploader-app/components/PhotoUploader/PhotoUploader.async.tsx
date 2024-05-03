import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

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
    void usersService.fetchCurrentUser();
  }, []);

  return (
    <div className={cnPhotoUploader()}>
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
