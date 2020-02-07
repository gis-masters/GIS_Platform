import React from 'react';
import { Button as BaseButton } from '@material-ui/core';
import { ButtonProps as BaseButtonProps } from '@material-ui/core/Button/Button';
import { cn } from '@bem-react/classname';

import { services } from '../../services/services';

import '!style-loader!css-loader!sass-loader!./Button.scss';

const cnButton = cn('Button');

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
      className: cnButton(null, [this.props.className]),
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
