import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { Button } from '../../../app/components/Button/Button';
import { photoUploaderStore } from '../../../photo-uploader-app/stores/PhotoUploader.store';

import '!style-loader!css-loader!sass-loader!./UpActions.scss';

const cnUpActions = cn('UpActions');

export const UpActions: FC = observer(() => (
  <div className={cnUpActions()}>
    <Button
      disabled={
        !photoUploaderStore.files.length || !photoUploaderStore.checkedLayer || !!photoUploaderStore.errors.length
      }
    >
      Загрузить
    </Button>
  </div>
));
