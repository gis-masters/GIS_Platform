import * as React from 'react';
import { Button as BaseButton } from '@material-ui/core';
import { ButtonProps as BaseButtonProps } from '@material-ui/core/Button/Button';

import { services } from '../../services/services';

import '!style-loader!css-loader!sass-loader!./Button.scss';

interface ButtonProps extends BaseButtonProps {
  routerLink?: string;
}

export class Button extends React.Component<ButtonProps> {
  private extendedProps: ButtonProps;

  constructor (props: ButtonProps) {
    super(props);
    this.navigate = this.navigate.bind(this);
  }

  render () {
    this.extendedProps = {
      ...this.props,
      onClick: this.props.routerLink ? this.navigate : this.props.onClick
    };
    delete this.extendedProps.routerLink;

    return <BaseButton {...this.extendedProps} />;
  }

  private navigate = () => {
    services.router.navigateByUrl(this.props.routerLink);
  }
}
