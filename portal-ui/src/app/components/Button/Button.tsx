import React, { Component, RefObject } from 'react';
import { Button as BaseButton } from '@mui/material';
import { ButtonProps as BaseButtonProps } from '@mui/material/Button/Button';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { services } from '../../services/services';

import '!style-loader!css-loader!sass-loader!./Button.scss';

const cnButton = cn('Button');

interface ButtonProps extends BaseButtonProps {
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
