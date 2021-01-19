import React, { Component } from 'react';
import { IClassNameProps, withBemMod } from '@bem-react/core';
import { ButtonBase } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';

import { BreadcrumbItemData, BreadcrumbsItemProps, cnBreadcrumbsItem } from '../Breadcrumbs-Item';

interface BreadcrumbsItemTypeButtonProps extends IClassNameProps {
  type: 'button';
  onClick?: (itemData: BreadcrumbItemData['payload']) => void;
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
  private handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
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
