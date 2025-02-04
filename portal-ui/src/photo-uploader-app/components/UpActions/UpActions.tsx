import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { Button } from '../../../app/components/Button/Button';
import { PhotoUploaderScreens, photoUploaderStore } from '../../../photo-uploader-app/stores/PhotoUploader.store';
import { uploadPhotos } from '../../services/photoUploader.service';

import '!style-loader!css-loader!sass-loader!./UpActions.scss';

const cnUpActions = cn('UpActions');

const clickHandler = async () => {
  photoUploaderStore.setCurrentScreen(PhotoUploaderScreens.LOADER);
  await uploadPhotos();
};

export const UpActions: FC = observer(() => (
  <div className={cnUpActions()}>
    <Button
      color='primary'
      onClick={clickHandler}
      disabled={
        !photoUploaderStore.files.length || !photoUploaderStore.checkedLayer || !!photoUploaderStore.errors.length
      }
    >
      Загрузить
    </Button>
  </div>
));
