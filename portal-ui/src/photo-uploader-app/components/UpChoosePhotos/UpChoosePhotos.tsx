import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { PhotoUploaderScreens, photoUploaderStore } from '../../stores/PhotoUploader.store';
import { UpChoosePhotoActions } from './Actions/UpChoosePhotos-Actions';
import { PseudoLink } from '../../../app/components/PseudoLink/PseudoLink';

import '!style-loader!css-loader!sass-loader!./UpChoosePhotos.scss';
import '!style-loader!css-loader!sass-loader!./Description/UpChoosePhotos-Description.scss';
import '!style-loader!css-loader!sass-loader!./Counter/UpChoosePhotos-Counter.scss';

const cnUpChoosePhotos = cn('UpChoosePhotos');

const clickHandler = () => {
  photoUploaderStore.setCurrentScreen(PhotoUploaderScreens.PHOTOLIST);
};

export const UpChoosePhoto: FC = observer(() => {
  return (
    <div className={cnUpChoosePhotos()}>
      {!!photoUploaderStore.files.length && (
        <div className={cnUpChoosePhotos('Counter')}>
          Выбрано:{' '}
          <PseudoLink className={cnUpChoosePhotos('Counter', { type: 'selected' })} onClick={clickHandler}>
            {photoUploaderStore.files.length} фотографий
          </PseudoLink>
          {!!photoUploaderStore.filesWithError && (
            <span className={cnUpChoosePhotos('Counter', { type: 'error' })}> (есть ошибки)</span>
          )}
        </div>
      )}
      {!photoUploaderStore.files.length && (
        <span className={cnUpChoosePhotos('Description')}>Фотографии не выбраны</span>
      )}
      <UpChoosePhotoActions />
    </div>
  );
});
