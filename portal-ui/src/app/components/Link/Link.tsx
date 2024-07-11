import React, { BaseHTMLAttributes, Component, FC, ForwardedRef, forwardRef } from 'react';
import { OpenInNew } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { ChildrenProps } from '../../services/models';
import { services } from '../../services/services';
import { sleep } from '../../services/util/sleep';

import '!style-loader!css-loader!sass-loader!./Link.scss';

const cnLink = cn('Link');

export interface LinkProps extends BaseHTMLAttributes<HTMLAnchorElement>, ChildrenProps {
  href: string;
  variant?: 'normal' | 'none' | 'contents';
  className?: string;
  target?: string;
  download?: string | boolean;
  disabled?: boolean;
  delay?: number;
  innerRef?: ForwardedRef<HTMLAnchorElement>;
  onClick?(e: React.MouseEvent<HTMLAnchorElement>): void;
}

class LinkComponent extends Component<LinkProps> {
  render() {
    const {
      children,
      className,
      href,
      target,
      variant = 'normal',
      download,
      disabled,
      innerRef,
      ...otherProps
    } = this.props;

    return (
      <a
        href={href}
        target={download ? '_blank' : target}
        className={cnLink({ variant, disabled }, [className])}
        download={download}
        ref={innerRef}
        {...otherProps}
        onClick={this.navigate}
      >
        {target === '_blank' && variant !== 'contents' && (
          <span className={cnLink('IconContainer')}>
            <OpenInNew className={cnLink('Icon')} />
          </span>
        )}
        {children}
      </a>
    );
  }

  @boundMethod
  private async navigate(e: React.MouseEvent<HTMLAnchorElement>) {
    const { href, target, download, disabled, delay, onClick } = this.props;

    if (onClick && !disabled) {
      onClick(e);
      if (e.defaultPrevented) {
        return;
      }
    }

    if (!target || disabled || delay) {
      if (disabled) {
        e.preventDefault();

        return;
      }

      if (!download) {
        e.preventDefault();

        if (delay) {
          await sleep(delay);
        }

        services.ngZone.run(() => {
          void services.router.navigateByUrl(href);
        });
      }
    }
  }
}

export const Link: FC<Omit<LinkProps, 'innerRef'>> = forwardRef((props, ref: ForwardedRef<HTMLAnchorElement>) => (
  <LinkComponent innerRef={ref} {...props} />
));
