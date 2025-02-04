import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';
import { cloneDeep } from 'lodash';

import { authService } from '../../services/auth/auth/auth.service';
import { PropertyType, Schema } from '../../services/data/schema/schema.models';
import { environment } from '../../services/environment';
import { services } from '../../services/services';
import { generateRandomId } from '../../services/util/randomId';
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
export default class RestorePasswordForm extends Component {
  @observable private formValue = cloneDeep(defaultData);
  @observable private emailValidationError?: string;
  @observable private successMessage = false;
  @observable private loading = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

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
          labelInField
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
                <div className={cnRestorePassword('Message')}>
                  Мы проверим, связана ли учетная запись с{' '}
                  <a href={`mailto:${this.formValue.email}`}>
                    <i>{this.formValue.email}</i>
                  </a>{' '}
                  и если да, вышлем вам инструкции о том, как сбросить ваш пароль.
                </div>
                <div className={cnRestorePassword('Message')}>
                  Если вы не получили от нас электронное письмо, пожалуйста, используйте действительный адрес
                  электронной почты для сброса пароля вашей учетной записи или проверьте свою папку "Спам".
                </div>
                <div className={cnRestorePassword('Message')}>
                  Внесите{' '}
                  <a href={`mailto:${environment.contactsEmail}`}>
                    <i>{environment.contactsEmail}</i>
                  </a>{' '}
                  в белый список, чтобы вы могли получать от нас электронные письма.
                </div>
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
      await authService.restorePassword(value.email);
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
