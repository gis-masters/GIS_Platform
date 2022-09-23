import React, { Component } from 'react';
import { IClassNameProps, withBemMod } from '@bem-react/core';
import { action, makeObservable, observable } from 'mobx';
import { ButtonBase, Tooltip } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';

import { BreadcrumbsItemData, BreadcrumbsItemProps, cnBreadcrumbsItem } from '../Breadcrumbs-Item';

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
      <Tooltip title={title} placement='top'>
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
    const itemTitle = e.currentTarget.children[0] as Partial<HTMLDivElement>;
    this.needTooltip = itemTitle.offsetWidth < itemTitle.scrollWidth;
  }
}

export const withTypeButton = withBemMod<BreadcrumbsItemProps, BreadcrumbsItemTypeButtonProps>(
  cnBreadcrumbsItem(),
  { type: 'button' },
  BreadcrumbsItem => props => <BreadcrumbsItem {...props} ContainerComponent={ContainerComponent} />
);
