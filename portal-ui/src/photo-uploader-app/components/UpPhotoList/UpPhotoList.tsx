import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Fab, List } from '@mui/material';
import { Add } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { UploadedFileStatus } from '../../services/photoUploader.models';
import { photoUploaderStore } from '../../stores/PhotoUploader.store';
import { UpActionsRemoveItemButton } from '../UpActions/RemoveItemButton/UpActions-RemoveItemButton';
import { UpAddFiles } from '../UpAddFiles/UpAddFiles';
import { UpLoadItem } from '../UpLoadItem/UpLoadItem';

import '!style-loader!css-loader!sass-loader!./UpPhotoList.scss';
import '!style-loader!css-loader!sass-loader!./Fab/UpPhotoList-Fab.scss';

const cnUpPhotoList = cn('UpPhotoList');

export const UpPhotoList: FC = observer(() => (
  <>
    <List className={cnUpPhotoList()}>
      {photoUploaderStore.files.map((item, idx) => (
        <UpLoadItem
          item={item}
          key={idx}
          actions={
            <UpActionsRemoveItemButton
              title={item.title}
              error={!item.feature.geometry?.coordinates.length || item.status === UploadedFileStatus.ERROR}
            />
          }
        />
      ))}
    </List>
    <UpAddFiles
      buttonProps={{ className: cnUpPhotoList('Button'), variant: 'contained' }}
      buttonCaption={
        <Fab className={cnUpPhotoList('Fab')} size='large' color='primary' variant='circular' component='span'>
          <Add fontSize='large' />
        </Fab>
      }
    />
  </>
));
