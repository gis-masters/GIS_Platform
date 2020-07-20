import React, { Component } from 'react';
import { OpenInNew } from '@material-ui/icons';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { services } from '../../services/services';

import '!style-loader!css-loader!sass-loader!./Link.scss';

const cnLink = cn('Link');

interface LinkProps {
  url: string;
  className?: string;
  children?: React.ReactChild;
  target?: string;
}

export class Link extends Component<LinkProps> {
  render() {
    const { children, className, url, target } = this.props;

    return (
      <a href={url} target={target} onClick={this.navigate} className={cnLink(null, [className])}>
        {target === '_blank' ? (
          <>
            <OpenInNew className={cnLink('Icon')} />
            &nbsp;
          </>
        ) : null}
        {children}
      </a>
    );
  }

  @boundMethod
  private async navigate(e: React.MouseEvent<HTMLAnchorElement>) {
    const { url, target } = this.props;

    if (!target) {
      e.preventDefault();
      await services.provided;
      services.ngZone.run(() => {
        services.router.navigateByUrl(url);
      });
    }
  }
}
