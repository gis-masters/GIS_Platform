import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { pluralize } from 'numeralize-ru';

import { PseudoLink } from '../../../../app/components/PseudoLink/PseudoLink';
import { PhotoUploaderScreens, photoUploaderStore } from '../../../stores/PhotoUploader.store';

import '!style-loader!css-loader!sass-loader!./UpLoadResult-Content.scss';

const cnUpLoadResult = cn('UpLoadResult');

const linkToListClickHandler = () => {
  photoUploaderStore.setCurrentScreen(PhotoUploaderScreens.LOADER);
};

export const UpLoadResultContent: FC = observer(() => {
  let successed = 0;
  let withError = 0;
  if (photoUploaderStore.uploadResult) {
    successed = photoUploaderStore.uploadResult.succeeded;
    withError = photoUploaderStore.uploadResult.withError;
  }

  return (
    <div className={cnUpLoadResult('Content')}>
      <div className={cnUpLoadResult('Success')}>
        Успешно загружен{pluralize(successed, 'а', 'о', 'о')} {successed} фотографи
        {pluralize(successed, 'я', 'и', 'й')}
      </div>
      {!!withError && (
        <div className={cnUpLoadResult('NotUploaded')}>
          Не загружено загружен{pluralize(withError, 'а', 'о', 'о')} {withError} фотографи
          {pluralize(withError, 'я', 'и', 'й')}
        </div>
      )}
      <PseudoLink className={cnUpLoadResult('LinkToList')} onClick={linkToListClickHandler}>
        Посмотреть список
      </PseudoLink>
    </div>
  );
});
