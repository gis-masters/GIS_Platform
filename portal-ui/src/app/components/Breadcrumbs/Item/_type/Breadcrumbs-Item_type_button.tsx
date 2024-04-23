import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ButtonBase, Tooltip } from '@mui/material';
import { IClassNameProps, withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { BreadcrumbsItemData } from '../../Breadcrumbs';
import { BreadcrumbsItemProps, cnBreadcrumbsItem } from '../Breadcrumbs-Item.base';

interface BreadcrumbsItemTypeButtonProps extends IClassNameProps {
  type: 'button';
  onClick?: (itemData: BreadcrumbsItemData['payload']) => void;
}

@observer
class ContainerComponent extends Component<BreadcrumbsItemProps> {
  @observable private needTooltip = false;

  constructor(props: BreadcrumbsItemProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { title, className, style, children } = this.props;

    const inner = (
      <ButtonBase className={className} onMouseEnter={this.handleMouseEnter} onClick={this.handleClick} style={style}>
        {children}
      </ButtonBase>
    );

    return this.needTooltip ? (
      <Tooltip title={title} placement='top' disableInteractive>
        {inner}
      </Tooltip>
    ) : (
      inner
    );
  }

  @boundMethod
  private handleClick() {
    const { payload, onClick } = this.props;
    if (onClick) {
      onClick(payload);
    }
  }

  @action.bound
  private handleMouseEnter(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const itemTitle = e.currentTarget.children[0];

    if (!(itemTitle instanceof HTMLElement)) {
      return;
    }
    this.needTooltip = itemTitle.offsetWidth < itemTitle.scrollWidth;
  }
}

export const withTypeButton = withBemMod<BreadcrumbsItemProps, BreadcrumbsItemTypeButtonProps>(
  cnBreadcrumbsItem(),
  { type: 'button' },
  BreadcrumbsItem => props => <BreadcrumbsItem {...props} ContainerComponent={ContainerComponent} />
);
