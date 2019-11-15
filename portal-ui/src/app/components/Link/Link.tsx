import * as React from 'react';

import { services } from '../../services/services';

interface LinkProps {
  url: string;
  className?: string;
  children?: React.ReactChild;
}

export class Link extends React.Component<LinkProps> {
  constructor (props: LinkProps) {
    super(props);
    this.navigate = this.navigate.bind(this);
  }

  render () {
    const { children, className, url } = this.props;

    return (
      <a href={url} onClick={this.navigate} className={className}>
        {children}
      </a>
    );
  }

  private async navigate (e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    await services.provided;
    services.ngZone.run(() => {
      services.router.navigateByUrl(this.props.url);
    });
  }
}
