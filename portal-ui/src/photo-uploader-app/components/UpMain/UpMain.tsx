import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';

import { photoUploaderStore } from '../../stores/PhotoUploader.store';
import { UpChooseLayer } from '../UpChooseLayer/UpChooseLayer';
import { UpChoosePhoto } from '../UpChoosePhotos/UpChoosePhotos';
import { UpPreviewer } from '../UpPreviewer/UpPreviewer';

import '!style-loader!css-loader!sass-loader!./UpMain.scss';

const cnUpMain = cn('UpMain');

export const UpMain: FC = observer(() => (
  <main className={cnUpMain()}>
    <UpChooseLayer />
    {!!photoUploaderStore.files.length && <UpPreviewer files={photoUploaderStore.files} />}
    <UpChoosePhoto />
  </main>
));
