import React, { Component, ReactNode } from 'react';
import { OpenInNew } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { sleep } from '../../services/util/sleep';
import { services } from '../../services/services';

import '!style-loader!css-loader!sass-loader!./Link.scss';

const cnLink = cn('Link');

interface LinkProps {
  href: string;
  theme?: 'normal' | 'none' | 'contents';
  className?: string;
  children?: ReactNode;
  target?: string;
  download?: string | boolean;
  disabled?: boolean;
  delay?: number;
}

export class Link extends Component<LinkProps> {
  render() {
    const { children, className, href, target, theme, download } = this.props;

    return (
      <a
        href={href}
        target={download ? '_blank' : target}
        onClick={this.navigate}
        className={cnLink({ theme: theme || 'normal' }, [className])}
        download={download}
      >
        {target === '_blank' && (
          <>
            <OpenInNew className={cnLink('Icon')} />
            &nbsp;
          </>
        )}
        {children}
      </a>
    );
  }

  @boundMethod
  private async navigate(e: React.MouseEvent<HTMLAnchorElement>) {
    const { href, target, download, disabled, delay } = this.props;

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
