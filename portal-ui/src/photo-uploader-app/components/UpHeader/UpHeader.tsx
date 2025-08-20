import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { User } from '../../../app/components/User/User';
import { currentUser } from '../../../app/stores/CurrentUser.store';
import { photoUploaderStore } from '../../stores/PhotoUploader.store';
import { UpHeaderLeftIcon } from './LeftIcon/UpHeader-LeftIcon';

import '!style-loader!css-loader!sass-loader!./UpHeader.scss';
import '!style-loader!css-loader!sass-loader!./Title/UpHeader-Title.scss';
import '!style-loader!css-loader!sass-loader!./User/UpHeader-User.scss';

const cnUpHeader = cn('UpHeader');

export const UpHeader: FC = observer(() => (
  <header className={cnUpHeader()}>
    {photoUploaderStore.needReturnButton && <UpHeaderLeftIcon />}
    <div className={cnUpHeader('Title')}>{photoUploaderStore.currentHeaderTitle}</div>
    {currentUser.name && <User className={cnUpHeader('User')} logoutUrl='/photo' />}
  </header>
));
