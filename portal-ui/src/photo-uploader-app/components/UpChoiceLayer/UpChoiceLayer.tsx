import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';

import { PhotoUploaderScreens, photoUploaderStore } from '../../stores/PhotoUploader.store';
import { Button } from '../../../app/components/Button/Button';
import { UpSelectedLayer } from '../UpSelectedLayer/UpSelectedLayer';

import '!style-loader!css-loader!sass-loader!./UpChoiceLayer.scss';
import '!style-loader!css-loader!sass-loader!./Annotation/UpChoiceLayer-Annotation.scss';
import '!style-loader!css-loader!sass-loader!./Button/UpChoiceLayer-Button.scss';

const cnUpChoiceLayer = cn('UpChoiceLayer');

const clickHandler = () => {
  photoUploaderStore.setCurrentScreen(PhotoUploaderScreens.LAYERSLIST);
};

export const UpChoiceLayer: FC = observer(() => (
  <div className={cnUpChoiceLayer()}>
    <span className={cnUpChoiceLayer('Annotation')}>
      {photoUploaderStore.checkedLayer ? 'Выбранный слой' : 'Слой не выбран'}
    </span>
    {!photoUploaderStore.checkedLayer && (
      <Button className={cnUpChoiceLayer('Button')} onClick={clickHandler}>
        Выбрать слой
      </Button>
    )}
    {photoUploaderStore.checkedLayer && <UpSelectedLayer />}
  </div>
));
