import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { SmartCaptcha } from '@yandex/smart-captcha';
import { boundMethod } from 'autobind-decorator';

import { FormControlProps } from '../Form/Control/Form-Control';

import '!style-loader!css-loader!sass-loader!./SmartCaptchaControl.scss';

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
    return (
      <div className={cnSmartCaptchaControl('Title')}>
        <SmartCaptcha
          test
          language='ru'
          sitekey='ysc1_bFH8WV9rW8qsqO3yPiqAxyYHgEk4FEiNyD91BlaZ7e53cafe'
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
