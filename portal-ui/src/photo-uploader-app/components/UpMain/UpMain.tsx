import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { photoUploaderStore } from '../../stores/PhotoUploader.store';
import { UpChoiceLayer } from '../UpChoiceLayer/UpChoiceLayer';
import { UpChoosePhoto } from '../UpChoosePhotos/UpChoosePhotos';
import { UpError } from '../UpError/UpError';
import { UpPreviewer } from '../UpPreviewer/UpPreviewer';

import '!style-loader!css-loader!sass-loader!./UpMain.scss';

const cnUpMain = cn('UpMain');

export const UpMain: FC = observer(() => (
  <>
    {!!photoUploaderStore.errors.length && <UpError />}
    {!photoUploaderStore.errors.length && (
      <main className={cnUpMain()}>
        <UpChoiceLayer />
        {!!photoUploaderStore.files.length && <UpPreviewer files={photoUploaderStore.files} />}
        <UpChoosePhoto />
      </main>
    )}
  </>
));
