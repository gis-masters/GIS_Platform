import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ActionsRight } from '../../ActionsRight/ActionsRight';
import { Button } from '../../Button/Button';
import { ChangePasswordFormTitle } from '../Title/ChangePasswordForm-Title';

import '!style-loader!css-loader!sass-loader!./ChangePasswordForm-Success.scss';

const cnChangePasswordForm = cn('ChangePasswordForm');

export const ChangePasswordFormSuccess: FC = () => (
  <div className={cnChangePasswordForm('Success')}>
    <ChangePasswordFormTitle>Пароль успешно изменён</ChangePasswordFormTitle>
    <div className={cnChangePasswordForm('Message')}>
      Теперь вы можете авторизоваться с новым паролем на главной странице.
    </div>
    <ActionsRight>
      <Button routerLink='/' color='primary'>
        Вернуться на главную страницу
      </Button>
    </ActionsRight>
  </div>
);
