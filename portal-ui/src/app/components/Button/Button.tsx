import React, { Component, RefObject } from 'react';
import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { services } from '../../services/services';

import '!style-loader!css-loader!sass-loader!./Button.scss';

const cnButton = cn('Button');

export interface ButtonProps extends LoadingButtonProps {
  routerLink?: string;
  btnRef?: RefObject<HTMLButtonElement>;
}

export class Button extends Component<ButtonProps> {
  render() {
    const { routerLink, href, btnRef, className, ...props } = this.props;
    const extendedProps: ButtonProps = {
      color: 'inherit',
      variant: 'outlined',
      ref: btnRef,
      className: cnButton(null, [className]),
      href: routerLink || href,
      ...props,
      onClick: this.onClickHandler
    };

    return <LoadingButton {...extendedProps} />;
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
