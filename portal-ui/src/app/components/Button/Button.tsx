import React, { Component } from 'react';
import { Button as BaseButton } from '@material-ui/core';
import { ButtonProps as BaseButtonProps } from '@material-ui/core/Button/Button';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { services } from '../../services/services';

import '!style-loader!css-loader!sass-loader!./Button.scss';

const cnButton = cn('Button');

interface ButtonProps extends BaseButtonProps {
  routerLink?: string;
}

export class Button extends Component<ButtonProps> {
  render() {
    const extendedProps: ButtonProps = {
      variant: 'outlined',
      ...this.props,
      className: cnButton(null, [this.props.className]),
      href: this.props.routerLink || this.props.href,
      onClick: this.onClickHandler
    };
    delete extendedProps.routerLink;

    return <BaseButton {...extendedProps} />;
  }

  @boundMethod
  private onClickHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }

    if (this.props.routerLink && !e.isDefaultPrevented()) {
      e.preventDefault();
      void this.navigate();
    }
  }

  private async navigate() {
    await services.provided;

    services.ngZone.run(() => {
      void services.router.navigateByUrl(this.props.routerLink);
    });
  }
}
