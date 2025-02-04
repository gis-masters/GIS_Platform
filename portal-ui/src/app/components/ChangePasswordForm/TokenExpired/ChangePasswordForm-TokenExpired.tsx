import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./ChangePasswordForm-TokenExpired.scss';

const cnChangePasswordForm = cn('ChangePasswordForm');

export const ChangePasswordFormTokenExpired: FC = () => (
  <div className={cnChangePasswordForm('TokenExpired')}>
    <div className={cnChangePasswordForm('Message')}>Время действия ссылки на восстановление пароля истекло.</div>
    <Button routerLink='/restore-password' color='primary'>
      Запросить новую ссылку для восстановления пароля
    </Button>
    <Button routerLink='/'>Вернуться на главную страницу</Button>
  </div>
);
