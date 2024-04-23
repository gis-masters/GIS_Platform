import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Fab, List } from '@mui/material';
import { PlayArrow, Stop } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { uploadPhotos } from '../../services/photoUploader.service';
import { photoUploaderStore } from '../../stores/PhotoUploader.store';
import { UpLoadHandler } from '../UpLoadHandler/UpLoadHadler';

import '!style-loader!css-loader!sass-loader!./UpLoader.scss';
import '!style-loader!css-loader!sass-loader!./Fab/UpLoader-Fab.scss';

const cnUpLoader = cn('UpLoader');

const clickHandler = async () => {
  if (photoUploaderStore.canUploading) {
    photoUploaderStore.setCanUploading(false);

    return;
  }
  photoUploaderStore.setCanUploading(true);
  await uploadPhotos();
};

export const UpLoader: FC = observer(() => {
  const Icon = photoUploaderStore.canUploading ? Stop : PlayArrow;
  const color = photoUploaderStore.canUploading ? 'warning' : 'success';

  return (
    <div className={cnUpLoader()}>
      <List className={cnUpLoader('List')}>
        {photoUploaderStore.files.map((item, idx) => (
          <UpLoadHandler item={item} key={idx} />
        ))}
      </List>
      {!photoUploaderStore.uploadResult && (
        <Fab className={cnUpLoader('Fab')} onClick={clickHandler} color={color} size='large' variant='circular'>
          <Icon fontSize='large' />
        </Fab>
      )}
    </div>
  );
});
