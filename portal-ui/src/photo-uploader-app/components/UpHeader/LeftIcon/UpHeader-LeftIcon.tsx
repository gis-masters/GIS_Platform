import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { CircularProgress, IconButton } from '@mui/material';
import { Done, KeyboardBackspace } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { PhotoUploaderScreens, photoUploaderStore } from '../../../stores/PhotoUploader.store';

import '!style-loader!css-loader!sass-loader!./UpHeader-LeftIcon.scss';
import '!style-loader!css-loader!sass-loader!../Loading/UpHeader-Loading.scss';

const cnUpHeader = cn('UpHeader');

const clickHandler = () => {
  photoUploaderStore.setCurrentScreen(photoUploaderStore.previousScreen || PhotoUploaderScreens.MAIN);
};

export const UpHeaderLeftIcon: FC = observer(() => (
  <>
    {photoUploaderStore.currentScreen === PhotoUploaderScreens.LOADER && photoUploaderStore.returnButtonBusy && (
      <CircularProgress className={cnUpHeader('Loading')} size={20} color='inherit' />
    )}

    {(photoUploaderStore.currentScreen === PhotoUploaderScreens.LAYERS_LIST ||
      photoUploaderStore.currentScreen === PhotoUploaderScreens.PHOTO_LIST ||
      photoUploaderStore.currentScreen === PhotoUploaderScreens.LOADER) &&
      !photoUploaderStore.returnButtonBusy && (
        <IconButton className={cnUpHeader('LeftIcon')} onClick={clickHandler}>
          <KeyboardBackspace color='inherit' />
        </IconButton>
      )}

    {photoUploaderStore.currentScreen === PhotoUploaderScreens.UPLOAD_RESULT && (
      <Done className={cnUpHeader('LeftIcon')} />
    )}
  </>
));
