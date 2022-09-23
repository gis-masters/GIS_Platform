import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ButtonBase, Menu, MenuItem } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { withBemMod } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { BreadcrumbsItemProps, cnBreadcrumbsItem } from '../Breadcrumbs-Item';
import { BreadcrumbsItem } from '../Breadcrumbs-Item.composed';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs-Item_type_showMore.scss';
import '!style-loader!css-loader!sass-loader!../../ShowMoreMenu/Breadcrumbs-ShowMoreMenu.scss';

const cnBreadcrumbsShowMoreMenu = cn('Breadcrumbs', 'ShowMoreMenu');

@observer
class ContainerComponent extends Component<BreadcrumbsItemProps> {
  @observable private anchorEl: HTMLElement | null = null;

  constructor(props: BreadcrumbsItemProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className, showMoreList } = this.props;
    const open = Boolean(this.anchorEl);

    return (
      <>
        <ButtonBase
          className={cnBreadcrumbsItem({ moreShown: open }, [className])}
          onClick={this.open}
          onMouseOver={this.open}
        >
          <MoreHoriz fontSize='inherit' />
        </ButtonBase>

        <Menu
          open={open}
          MenuListProps={{ onMouseLeave: this.close, className: cnBreadcrumbsShowMoreMenu() }}
          anchorEl={this.anchorEl}
          onClose={this.close}
        >
          {showMoreList?.map((item, i) => (
            <MenuItem key={i} onClick={this.close}>
              <BreadcrumbsItem {...item} nestingLevel={i + 1} type={'button'} />
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  @action.bound
  private open(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    this.anchorEl = e.target as HTMLElement;
  }

  @action.bound
  private close() {
    this.anchorEl = null;
  }
}

export const withTypeShowMore = withBemMod<BreadcrumbsItemProps, BreadcrumbsItemProps>(
  cnBreadcrumbsItem(),
  { type: 'showMore' },
  BreadcrumbsItem => props => <BreadcrumbsItem {...props} ContainerComponent={ContainerComponent} />
);
