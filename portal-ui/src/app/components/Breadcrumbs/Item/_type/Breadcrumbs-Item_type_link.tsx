import React, { Component } from 'react';
import { IClassNameProps, withBemMod } from '@bem-react/core';
import { ButtonBase, Tooltip } from '@mui/material';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';

import { Link } from '../../../Link/Link';

import { BreadcrumbsItemProps, cnBreadcrumbsItem } from '../Breadcrumbs-Item';

interface BreadcrumbsItemTypeLinkProps extends IClassNameProps {
  type: 'link';
  url?: string;
}

@observer
class ContainerComponent extends Component<BreadcrumbsItemProps> {
  @observable private needTooltip = false;

  constructor(props: BreadcrumbsItemProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className, children, url } = this.props;

    const inner = (
      <ButtonBase className={className} onMouseEnter={this.handleMouseEnter}>
        {children}
      </ButtonBase>
    );

    return (
      <Link href={url} variant='contents'>
        {this.needTooltip ? (
          <Tooltip title={children} placement='top'>
            {inner}
          </Tooltip>
        ) : (
          inner
        )}
      </Link>
    );
  }

  @action.bound
  private handleMouseEnter(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const itemTitle = e.currentTarget.children[0] as Partial<HTMLDivElement>;
    this.needTooltip = itemTitle.offsetWidth < itemTitle.scrollWidth;
  }
}

export const withTypeLink = withBemMod<BreadcrumbsItemProps, BreadcrumbsItemTypeLinkProps>(
  cnBreadcrumbsItem(),
  { type: 'link' },
  BreadcrumbsItem => props => <BreadcrumbsItem {...props} ContainerComponent={ContainerComponent} />
);
