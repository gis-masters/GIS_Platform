import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';
import { cn } from '@bem-react/classname';
import { cloneDeep } from 'lodash';
import { Dialog, DialogActions, DialogContent } from '@mui/material';

import { PropertyType, Schema } from '../../services/data/schema.models';
import { generateRandomId } from '../../services/util/randomId';
import { authService } from '../../services/auth.service';
import { services } from '../../services/services';
import { env } from '../../stores/Env.store';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';

import '!style-loader!css-loader!sass-loader!./RestorePasswordForm.scss';
import '!style-loader!css-loader!sass-loader!../HomePageForm/HomePageForm.scss';

const cnRestorePassword = cn('RestorePassword');

interface RestorePassword {
  email: string;
}

const defaultData: RestorePassword = {
  email: ''
};

const schema = {
  properties: [
    {
      name: 'email',
      title: 'E-mail',
      wellKnownRegex: 'email',
      required: true,
      propertyType: PropertyType.STRING
    }
  ]
};

@observer
export class RestorePasswordForm extends Component {
  @observable private formValue = cloneDeep(defaultData);
  @observable private emailValidationError: string;
  @observable private errorMessage: string;
  @observable private successMessage = false;
  @observable private loading: boolean;

  render() {
    const htmlId = generateRandomId();

    return (
      <div className={cnRestorePassword(null, ['HomePageForm'])}>
        <Form<Partial<RestorePassword>>
          id={htmlId}
          className={cnRestorePassword('Form')}
          schema={schema as unknown as Schema}
          value={this.formValue}
          auto
          labelInTextField
          actionFunction={this.restorePassword}
          onActionSuccess={this.showSuccessMessage}
          actions={
            <div className={cnRestorePassword('Actions')}>
              <Button disabled={this.loading} form={htmlId} type='submit' color='primary'>
                Запросить новый пароль
              </Button>
            </div>
          }
        >
          <div className={cnRestorePassword('Title')}>Восстановление пароля</div>
        </Form>
        <Dialog open={this.successMessage} onClose={this.onClose} maxWidth='sm' fullWidth>
          <DialogContent>
            {this.successMessage && (
              <>
                Мы проверим, связана ли учетная запись с "{this.formValue.email}" и если да, вышлем вам инструкции о
                том, как сбросить ваш пароль. Если вы не получили от нас электронное письмо, пожалуйста, используйте
                действительный адрес электронной почты для сброса пароля вашей учетной записи. Или проверьте свою папку
                "спам" и внесите {env.contactsEmail} в белый список, чтобы вы могли получать от нас электронные письма.
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onClose}>Закрыть</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  @action.bound
  private handleEmail(email: string) {
    this.formValue.email = email;
  }

  @action.bound
  private showSuccessMessage() {
    this.successMessage = true;
  }

  @boundMethod
  private async restorePassword(value: RestorePassword) {
    if (value.email) {
      this.handleEmail(value.email);
    }

    this.handleLoading(true);

    if (this.emailValidationError) {
      this.handleLoading(false);

      return;
    }

    try {
      await authService.restorePassword(value.email, location.origin);
      this.showSuccessMessage();
    } catch (error) {
      const err = error as AxiosError<{ errors: Record<string, string>[] }>;
      const errors = err.response?.data?.errors || [];

      throw [{ field: 'password', messages: errors }];
    }

    this.handleLoading(false);
  }

  @action.bound
  private handleLoading(isLoading: boolean): void {
    this.loading = isLoading;
  }

  @action.bound
  private onClose(): void {
    if (this.successMessage) {
      services.ngZone.run(() => {
        void services.router.navigateByUrl('/');
      });
    }

    this.successMessage = false;
  }
}
