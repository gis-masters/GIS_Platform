import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { PseudoLink } from '../../../../app/components/PseudoLink/PseudoLink';
import { PhotoUploaderScreens, photoUploaderStore } from '../../../stores/PhotoUploader.store';

import '!style-loader!css-loader!sass-loader!./UpPreviewer-AdditionalCounter.scss';

const cnUpPreviewer = cn('UpPreviewer');

interface UpPreviewerAdditionalCounterProps {
  count: number;
}

const clickHadler = () => {
  photoUploaderStore.setCurrentScreen(PhotoUploaderScreens.PHOTO_LIST);
};

export const UpPreviewerAdditionalCounter: FC<UpPreviewerAdditionalCounterProps> = observer(({ count }) => (
  <li className={cnUpPreviewer('AdditionalCounter')}>
    <PseudoLink onClick={clickHadler} color='inherit'>
      <span className={cnUpPreviewer('AdditionalCounterText')}>Ещё {count}...</span>
    </PseudoLink>
  </li>
));
