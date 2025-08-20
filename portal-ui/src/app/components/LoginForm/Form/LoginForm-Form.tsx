import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { http } from '../../../services/api/http.service';
import { getEsiaUrl } from '../../../services/api/server-urls.service';
import { PropertyType, SimpleSchema } from '../../../services/data/schema/schema.models';
import { environment } from '../../../services/environment';
import { ActionsLeft } from '../../ActionsLeft/ActionsLeft';
import { ActionsRight } from '../../ActionsRight/ActionsRight';
import { Button } from '../../Button/Button';
import { Form } from '../../Form/Form';
import { AuthUserData } from '../LoginForm.async';

const cnLoginFormForm = cn('LoginForm', 'Form');

const schema: SimpleSchema = {
  properties: [
    {
      name: 'username',
      title: 'E-mail',
      required: true,
      display: 'email',
      propertyType: PropertyType.STRING
    },
    {
      name: 'password',
      title: 'Пароль',
      required: true,
      display: 'password',
      propertyType: PropertyType.STRING
    }
  ]
};

interface LoginFormFormProps {
  userData: AuthUserData;
  notShowEsiaIn?: boolean;
  notRightActions?: boolean;
  actionFunction(value: AuthUserData): Promise<void>;
}

@observer
export class LoginFormForm extends Component<LoginFormFormProps> {
  @observable private esiaLoading = false;

  constructor(props: LoginFormFormProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { userData, actionFunction, notShowEsiaIn, notRightActions } = this.props;

    return (
      <Form<AuthUserData>
        className={cnLoginFormForm()}
        schema={schema}
        value={userData}
        auto
        labelInField
        actionFunction={actionFunction}
        actions={
          <>
            <ActionsLeft>
              <Button type='submit' color='primary' disabled={this.esiaLoading}>
                Войти
              </Button>
              {!notShowEsiaIn && !!environment.esia?.length && (
                <Button onClick={this.authWithEsia} loading={this.esiaLoading}>
                  Войти с помощью ГОСУСЛУГ
                </Button>
              )}
            </ActionsLeft>
            {!notRightActions && (
              <ActionsRight>
                <Button routerLink='/restore-password' disabled={this.esiaLoading}>
                  Восстановить пароль
                </Button>
              </ActionsRight>
            )}
          </>
        }
      />
    );
  }

  @action.bound
  private async authWithEsia() {
    this.esiaLoading = true;

    window.location.href = await http.get<string>(getEsiaUrl(), { cache: { disabled: true } });
  }
}
