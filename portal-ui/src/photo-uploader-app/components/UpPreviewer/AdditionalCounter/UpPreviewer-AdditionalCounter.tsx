import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';

import '!style-loader!css-loader!sass-loader!./UpPreviewer-AdditionalCounter.scss';

const cnUpPreviewer = cn('UpPreviewer');

interface UpPreviewerAdditionalCounterProps {
  count: number;
}

export const UpPreviewerAdditionalCounter: FC<UpPreviewerAdditionalCounterProps> = observer(({ count }) => (
  <li className={cnUpPreviewer('AdditionalCounter')}>
    <span className={cnUpPreviewer('AdditionalCounterText')}>Ещё {count}...</span>
  </li>
));
