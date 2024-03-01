import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { photoUploaderStore } from '../../stores/PhotoUploader.store';
import { UpChoosePhotoActions } from './Actions/UpChoosePhotos-Actions';
import { PseudoLink } from '../../../app/components/PseudoLink/PseudoLink';

import '!style-loader!css-loader!sass-loader!./UpChoosePhotos.scss';
import '!style-loader!css-loader!sass-loader!./Description/UpChoosePhotos-Description.scss';
import '!style-loader!css-loader!sass-loader!./Counter/UpChoosePhotos-Counter.scss';

const cnUpChoosePhotos = cn('UpChoosePhotos');

export const UpChoosePhoto: FC = observer(() => {
  const onClickHadler = useCallback(() => {
    //do nothing
  }, []);

  return (
    <div className={cnUpChoosePhotos()}>
      {!!photoUploaderStore.files.length && (
        <div className={cnUpChoosePhotos('Counter')}>
          Выбрано:{' '}
          <PseudoLink className={cnUpChoosePhotos('Counter', { type: 'selected' })} onClick={onClickHadler}>
            {photoUploaderStore.files.length} фотографий
          </PseudoLink>
          {!!photoUploaderStore.errors.length && (
            <span className={cnUpChoosePhotos('Counter', { type: 'error' })}>({photoUploaderStore.errors})</span>
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
