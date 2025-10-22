import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { SmartCaptcha } from '@yandex/smart-captcha';
import { boundMethod } from 'autobind-decorator';

import { environment } from '../../services/environment';
import { type FormControlProps } from '../Form/Control/Form-Control';

import './SmartCaptchaControl.scss';

const cnSmartCaptchaControl = cn('SmartCaptchaControl');

type JavascriptErrorData = {
  filename: string;
  message: string;
};

@observer
export class SmartCaptchaControl extends Component<FormControlProps> {
  constructor(props: FormControlProps) {
    super(props);
  }

  render() {
    const { test, language, siteKey } = environment.captcha;

    return (
      <div className={cnSmartCaptchaControl('Title')}>
        <SmartCaptcha
          test={test}
          language={language}
          sitekey={siteKey}
          onJavascriptError={this.onError}
          onSuccess={this.onSuccess}
        />
      </div>
    );
  }

  private onError(error: JavascriptErrorData): void {
    throw new Error(error.message);
  }

  @boundMethod
  private onSuccess(token: string): void {
    const { onChange, property } = this.props;

    if (onChange) {
      onChange({
        value: token,
        propertyName: property.name
      });
    }
  }
}
