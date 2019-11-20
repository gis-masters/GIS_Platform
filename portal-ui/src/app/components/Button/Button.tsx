import * as React from 'react';
import { Button as BaseButton } from '@material-ui/core';
import { ButtonProps as BaseButtonProps } from '@material-ui/core/Button/Button';

import { services } from '../../services/services';

import '!style-loader!css-loader!sass-loader!./Button.scss';

interface ButtonProps extends BaseButtonProps {
  routerLink?: string;
}

export class Button extends React.Component<ButtonProps> {
  constructor (props: ButtonProps) {
    super(props);

    this.onClickHandler = this.onClickHandler.bind(this);
  }

  render () {
    const extendedProps: ButtonProps = {
      ...this.props,
      href: this.props.routerLink || this.props.href,
      onClick: this.onClickHandler
    };
    delete extendedProps.routerLink;

    return <BaseButton {...extendedProps} />;
  }

  private onClickHandler (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }

    if (this.props.routerLink && !e.isDefaultPrevented()) {
      e.preventDefault();
      this.navigate();
    }
  }

  private async navigate () {
    await services.provided;

    services.ngZone.run(() => {
      services.router.navigateByUrl(this.props.routerLink);
    });
  }
}
