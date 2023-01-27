import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { env } from '../../../stores/Env.store';
import { PropertyType, Schema } from '../../../services/data/schema.models';
import { getEsiaUrl } from '../../../services/server-urls.service';
import { http } from '../../../services/http.service';
import { ActionsRight } from '../../ActionsRight/ActionsRight';
import { ActionsLeft } from '../../ActionsLeft/ActionsLeft';
import { Button } from '../../Button/Button';
import { Form } from '../../Form/Form';

import { AuthUserData } from '../LoginForm.async';

const cnLoginFormForm = cn('LoginForm', 'Form');

const schema: Schema = {
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
  actionFunction: (value: AuthUserData) => Promise<void>;
}

@observer
export class LoginFormForm extends Component<LoginFormFormProps> {
  @observable private esiaLoading = false;

  constructor(props: LoginFormFormProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { userData, actionFunction } = this.props;

    return (
      <Form<AuthUserData>
        className={cnLoginFormForm()}
        schema={schema}
        value={userData}
        auto
        labelInTextField
        actionFunction={actionFunction}
        actions={
          <>
            <ActionsLeft>
              <Button type='submit' color='primary' disabled={this.esiaLoading}>
                Войти
              </Button>
              {!!env.esia?.length && (
                <Button onClick={this.authWithEsia} loading={this.esiaLoading}>
                  Войти с помощью ГОСУСЛУГ
                </Button>
              )}
            </ActionsLeft>
            <ActionsRight>
              <Button href='/restore-password' disabled={this.esiaLoading}>
                Восстановить пароль
              </Button>
            </ActionsRight>
          </>
        }
      />
    );
  }

  @action.bound
  private async authWithEsia() {
    this.esiaLoading = true;

    window.location.href = await http.get<string>(await getEsiaUrl(), { cache: { disabled: true } });
  }
}
