import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { pluralize } from 'numeralize-ru';

import { PseudoLink } from '../../../app/components/PseudoLink/PseudoLink';
import { PhotoUploaderScreens, photoUploaderStore } from '../../stores/PhotoUploader.store';
import { UpTags } from '../UpTags/UpTags';
import { UpChoosePhotoActions } from './Actions/UpChoosePhotos-Actions';

import '!style-loader!css-loader!sass-loader!./UpChoosePhotos.scss';
import '!style-loader!css-loader!sass-loader!./Description/UpChoosePhotos-Description.scss';
import '!style-loader!css-loader!sass-loader!./Counter/UpChoosePhotos-Counter.scss';

const cnUpChoosePhotos = cn('UpChoosePhotos');

const clickHandler = () => {
  photoUploaderStore.setCurrentScreen(PhotoUploaderScreens.PHOTO_LIST);
};

export const UpChoosePhoto: FC = observer(() => {
  return (
    <div className={cnUpChoosePhotos()}>
      {!!photoUploaderStore.files.length && (
        <>
          <div className={cnUpChoosePhotos('Counter')}>
            Выбрано:{' '}
            <PseudoLink className={cnUpChoosePhotos('Counter', { type: 'selected' })} onClick={clickHandler}>
              {photoUploaderStore.files.length} фотографи{pluralize(photoUploaderStore.files.length, 'я', 'и', 'й')}
            </PseudoLink>
            {!!photoUploaderStore.filesWithError && (
              <span className={cnUpChoosePhotos('Counter', { type: 'error' })}> (есть ошибки)</span>
            )}
          </div>
          <UpTags />
        </>
      )}
      {!photoUploaderStore.files.length && (
        <span className={cnUpChoosePhotos('Description')}>Фотографии не выбраны</span>
      )}
      <UpChoosePhotoActions />
    </div>
  );
});
