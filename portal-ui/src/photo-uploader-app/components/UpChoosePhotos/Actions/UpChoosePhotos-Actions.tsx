import React, { type FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { Button } from '../../../../app/components/Button/Button';
import { doConfirm } from '../../../../app/services/answer-modals.service';
import { photoUploaderStore } from '../../../stores/PhotoUploader.store';
import { UpAddFiles } from '../../UpAddFiles/UpAddFiles';

import './UpChoosePhotos-Actions.scss';

const cnUpChoosePhotosActions = cn('UpChoosePhotos', 'Actions');

const clearHandler = async () => {
  if (
    await doConfirm({
      message: 'Вы уверены, что хотите удалить из списка все добавленные фотографии?'
    })
  ) {
    photoUploaderStore.clearUploadedFiles();
  }
};

export const UpChoosePhotoActions: FC = observer(() => (
  <div className={cnUpChoosePhotosActions()}>
    <UpAddFiles buttonCaption={photoUploaderStore.files.length ? 'Добавить' : 'Выбрать'} />
    {!!photoUploaderStore.files.length && <Button onClick={clearHandler}>Очистить</Button>}
  </div>
));
