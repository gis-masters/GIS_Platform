import React, { Component, FC, ForwardedRef, forwardRef, RefObject } from 'react';
import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { services } from '../../services/services';

import '!style-loader!css-loader!sass-loader!./Button.scss';

const cnButton = cn('Button');

export interface ButtonProps extends LoadingButtonProps {
  routerLink?: string;
  innerRef?: RefObject<HTMLButtonElement> | ForwardedRef<HTMLButtonElement>;
}

class ButtonComponent extends Component<ButtonProps> {
  render() {
    const { routerLink, href, innerRef, className, children, ...props } = this.props;
    const extendedProps: ButtonProps = {
      color: 'inherit',
      variant: 'outlined',
      className: cnButton(null, [className]),
      href: routerLink || href,
      children: <span className={cnButton('Text')}>{children}</span>,
      ...props,
      onClick: this.handleClick
    };

    return <LoadingButton ref={innerRef} {...extendedProps} />;
  }

  @boundMethod
  private handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
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
      if (this.props.routerLink) {
        void services.router.navigateByUrl(this.props.routerLink);
      }
    });
  }
}

export const Button: FC<Omit<ButtonProps, 'innerRef'>> = forwardRef<HTMLButtonElement>(
  (props, ref: ForwardedRef<HTMLButtonElement>) => <ButtonComponent innerRef={ref} {...props} />
);
