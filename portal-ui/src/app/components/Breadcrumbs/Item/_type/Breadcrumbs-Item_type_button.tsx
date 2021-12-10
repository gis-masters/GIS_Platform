import React, { Component } from 'react';
import { IClassNameProps, withBemMod } from '@bem-react/core';
import { ButtonBase } from '@mui/material';
import { boundMethod } from 'autobind-decorator';

import { BreadcrumbsItemData, BreadcrumbsItemProps, cnBreadcrumbsItem } from '../Breadcrumbs-Item';

interface BreadcrumbsItemTypeButtonProps extends IClassNameProps {
  type: 'button';
  onClick?: (itemData: BreadcrumbsItemData['payload']) => void;
}

class ContainerComponent extends Component<BreadcrumbsItemProps> {
  render() {
    const { className, children } = this.props;

    return (
      <ButtonBase className={className} onClick={this.handleClick}>
        {children}
      </ButtonBase>
    );
  }

  @boundMethod
  private handleClick() {
    const { payload, onClick } = this.props;
    if (onClick) {
      onClick(payload);
    }
  }
}

export const withTypeButton = withBemMod<BreadcrumbsItemProps, BreadcrumbsItemTypeButtonProps>(
  cnBreadcrumbsItem(),
  { type: 'button' },
  BreadcrumbsItem => props => <BreadcrumbsItem {...props} ContainerComponent={ContainerComponent} />
);
