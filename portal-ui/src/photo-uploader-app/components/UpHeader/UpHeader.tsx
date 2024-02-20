import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';

import { currentUser } from '../../../app/stores/CurrentUser.store';
import { User } from '../../../app/components/User/User';

import '!style-loader!css-loader!sass-loader!./UpHeader.scss';

interface UpHeaderProps {
  title?: string;
}

const cnUpHeader = cn('UpHeader');

export const UpHeader: FC<UpHeaderProps> = observer(({ title }) => (
  <header className={cnUpHeader()}>
    <div className={cnUpHeader('Title')}>{title || 'Загрузка фотографий'}</div>
    {currentUser.name && <User className={cnUpHeader('User')} />}
  </header>
));
