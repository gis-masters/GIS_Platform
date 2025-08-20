import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ButtonBase, Tooltip } from '@mui/material';
import { IClassNameProps, withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { Link } from '../../../Link/Link';
import { BreadcrumbsItemProps, cnBreadcrumbsItem } from '../Breadcrumbs-Item.base';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs-Item_type_link.scss';

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
    const { url, title, className, style, children } = this.props;

    if (!url) {
      console.error('Breadcrumbs-Item_type_link: не указан url');
    }

    const inner = (
      <ButtonBase className={className} onMouseEnter={this.handleMouseEnter} style={style}>
        <Link href={url || ''} onClick={this.handleClick}>
          {children}
        </Link>
      </ButtonBase>
    );

    return (
      <>
        {this.needTooltip ? (
          <Tooltip title={title} placement='top' disableInteractive>
            <span>{inner}</span>
          </Tooltip>
        ) : (
          inner
        )}
      </>
    );
  }

  @action.bound
  private handleMouseEnter(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const itemTitle = e.currentTarget.children[0];
    if (itemTitle instanceof HTMLElement) {
      this.needTooltip = itemTitle.offsetWidth < itemTitle.scrollWidth;
    }
  }

  @boundMethod
  private handleClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    const { onClick, payload } = this.props;

    if (onClick) {
      e.preventDefault();
      onClick(payload);
    }
  }
}

export const withTypeLink = withBemMod<BreadcrumbsItemProps, BreadcrumbsItemTypeLinkProps>(
  cnBreadcrumbsItem(),
  { type: 'link' },
  BreadcrumbsItem => props => <BreadcrumbsItem {...props} ContainerComponent={ContainerComponent} />
);
