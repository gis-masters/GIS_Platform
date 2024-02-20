import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { PhotoUploaderScreens, photoUploaderStore } from '../../stores/PhotoUploader.store';
import { Loading } from '../../../app/components/Loading/Loading';

import { UpAuth } from '../UpAuth/UpAuth';
import { UpHeader } from '../UpHeader/UpHeader';
import { UpMain } from '../UpMain/UpMain';
import { UpActions } from '../UpActions/UpActions';

import '!style-loader!css-loader!sass-loader!./PhotoUploader.scss';

const cnPhotoUploader = cn('PhotoUploader');

const PhotoUploader: FC = observer(() => (
  <div className={cnPhotoUploader()}>
    {photoUploaderStore.currentScreen === PhotoUploaderScreens.AUTH && <UpAuth />}
    {photoUploaderStore.currentScreen === PhotoUploaderScreens.MAIN && (
      <>
        <Loading global visible={photoUploaderStore.busy} />
        <UpHeader />
        <UpMain />
        <UpActions />
      </>
    )}
  </div>
));

export default PhotoUploader;
